import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';
import _ from 'lodash';
import getLocations from '@utils/getLocations';

export const useEditShipmentMutation = (organization, history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (shipmentData) => {
      const {
        start_custody, end_custody, files, carriers, updateGateway, deleteFiles, isWarehouse,
      } = shipmentData;
      let shipmentPayload = shipmentData.shipment;
      let uploadFile = null;
      if (!_.isEmpty(files)) {
        const responses = await Promise.all(_.map(files, async (file) => {
          uploadFile = new FormData();
          uploadFile.append('file', file, file.name);
          uploadFile.append('shipment_uuid', shipmentPayload.shipment_uuid);
          const uploadResponse = await httpService.makeRequest(
            'post',
            `${window.env.API_URL}shipment/upload_file/`,
            uploadFile,
          );
          return uploadResponse;
        }));
        shipmentPayload = {
          ...shipmentPayload,
          uploaded_pdf: shipmentPayload.uploaded_pdf
            ? [...shipmentPayload.uploaded_pdf, ..._.map(files, 'name')]
            : _.map(files, 'name'),
          uploaded_pdf_link: shipmentPayload.uploaded_pdf_link
            ? [...shipmentPayload.uploaded_pdf_link, ..._.map(_.flatMap(_.map(responses, 'data')), 'aws url')]
            : _.map(_.flatMap(_.map(responses, 'data')), 'aws url'),
        };
      }
      if (!_.isEmpty(deleteFiles)) {
        const responses = await Promise.all(_.map(deleteFiles, async (file) => (
          // eslint-disable-next-line no-return-await
          await httpService.makeRequest(
            'post',
            `${window.env.API_URL}shipment/delete_file/`,
            { filename: file, shipment_uuid: shipmentPayload.shipment_uuid },
          )
        )));
      }
      if (!_.isEmpty(updateGateway)) {
        shipmentPayload = {
          ...shipmentPayload,
          gateway_ids: [updateGateway.gateway_uuid],
          gateway_imei: [_.toString(updateGateway.imei_number)],
        };
      }
      const data = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}shipment/shipment/${shipmentPayload.id}/`,
        shipmentPayload,
      );
      if (data && data.data) {
        let startCustody = {
          ...start_custody,
          start_of_custody_location: start_custody.location,
          end_of_custody_location: end_custody.location,
        };
        const endCustody = {
          ...end_custody,
          start_of_custody_location: end_custody.location,
          end_of_custody_location: end_custody.location,
        };
        let locations = [];
        if (!_.isEmpty(carriers)) {
          locations = await getLocations(_.map(carriers, 'location'));
          const first_custody = _.first(locations);
          startCustody = {
            ...startCustody,
            end_of_custody_location: first_custody,
          };
        }
        if (startCustody.id) {
          await httpService.makeRequest(
            'patch',
            `${window.env.API_URL}custodian/custody/${startCustody.id}/`,
            startCustody,
          );
        } else {
          await httpService.makeRequest(
            'post',
            `${window.env.API_URL}custodian/custody/`,
            {
              ...startCustody,
              shipment_id: data.data.shipment_uuid,
              shipment: data.data.id,
            },
          );
        }
        if (!_.isEmpty(carriers)) {
          await Promise.all(
            _.map(carriers, async (carrier, index) => {
              if (carrier.id) {
                const custodyPayload = {
                  ...carrier,
                  start_of_custody_location: locations[index],
                  end_of_custody_location: _.lt(index + 1, _.size(locations))
                    ? locations[index + 1]
                    : endCustody.start_of_custody_location,
                };
                // eslint-disable-next-line no-return-await
                return await httpService.makeRequest(
                  'patch',
                  `${window.env.API_URL}custodian/custody/${custodyPayload.id}/`,
                  custodyPayload,
                );
              }
              // eslint-disable-next-line no-return-await
              return await httpService.makeRequest(
                'post',
                `${window.env.API_URL}custodian/custody/`,
                {
                  ...carrier,
                  start_of_custody_location: locations[index],
                  end_of_custody_location: _.lt(index + 1, _.size(locations))
                    ? locations[index + 1]
                    : end_custody.location,
                  shipment_id: data.data.shipment_uuid,
                  shipment: data.data.id,
                },
              );
            }),
          );
        }
        if (endCustody.id) {
          await httpService.makeRequest(
            'patch',
            `${window.env.API_URL}custodian/custody/${endCustody.id}/`,
            endCustody,
          );
        } else {
          await httpService.makeRequest(
            'post',
            `${window.env.API_URL}custodian/custody/`,
            {
              ...endCustody,
              shipment_id: data.data.shipment_uuid,
              shipment: data.data.id,
            },
          );
        }
        if (updateGateway) {
          setTimeout(async () => {
            let gateway_status = '';
            let shipment_ids = [];
            let { battery_alert_level } = updateGateway;
            switch (data.data.status) {
              case 'Completed':
              case 'Cancelled':
              case 'Damaged':
              case 'Battery Depleted':
                gateway_status = 'unavailable';
                shipment_ids = [];
                battery_alert_level = 0;
                break;
              case 'Planned':
              case 'En route':
                gateway_status = 'assigned';
                shipment_ids = data.data.partner_shipment_id ? [data.data.partner_shipment_id] : [];
                break;
              default:
                break;
            }
            const gatewayPayload = {
              ...updateGateway,
              gateway_status,
              shipment_ids,
              battery_alert_level,
            };
            await httpService.makeRequest(
              'patch',
              `${window.env.API_URL}sensors/gateway/${gatewayPayload.id}`,
              gatewayPayload,
            );
            if (_.includes(['planned', 'en route', 'arrived'], _.toLower(data.data.status))) {
              const configurePayload = {
                platform_type: data.data.platform_name,
                gateway: updateGateway.imei_number,
                transmission_interval: _.isEqual(_.toLower(data.data.status), 'planned') || (_.isEqual(_.toLower(data.data.status), 'arrived') && !isWarehouse) ? 5 : data.data.transmission_time,
                measurement_interval: _.isEqual(_.toLower(data.data.status), 'planned') || (_.isEqual(_.toLower(data.data.status), 'arrived') && !isWarehouse) ? 5 : data.data.measurement_time,
              };
              await httpService.makeRequest(
                'post',
                `${window.env.API_URL}sensors/configure_gateway/`,
                configurePayload,
              );
            }
          }, 500);
        }
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['shipments', 'Planned,En route,Arrived', organization],
        });
        await queryClient.invalidateQueries({
          queryKey: ['allGateways'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['custodians', organization],
        });
        displayAlert('success', 'Successfully edited shipment');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating shipment');
      },
    },
  );
};
