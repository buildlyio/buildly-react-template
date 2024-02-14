import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';
import _ from 'lodash';
import getLocations from '@utils/getLocations';

export const useAddShipmentMutation = (organization, history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (shipmentData) => {
      const {
        start_custody, end_custody, files, carriers, updateGateway,
      } = shipmentData;
      let shipmentPayload = shipmentData.shipment;
      let uploadFile = null;
      const data = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}shipment/shipment/`,
        shipmentPayload,
      );
      if (data && data.data) {
        if (!_.isEmpty(files)) {
          const responses = await Promise.all(_.map(files, async (file) => {
            uploadFile = new FormData();
            uploadFile.append('file', file, file.name);
            uploadFile.append('shipment_uuid', data.data.shipment_uuid);
            const uploadResponse = await httpService.makeRequest(
              'post',
              `${window.env.API_URL}shipment/upload_file/`,
              uploadFile,
            );
            return uploadResponse;
          }));
          shipmentPayload = {
            ...data.data,
            uploaded_pdf: _.map(files, 'name'),
            uploaded_pdf_link: _.map(_.flatMap(_.map(responses, 'data')), 'aws url'),
          };
          await httpService.makeRequest(
            'patch',
            `${window.env.API_URL}shipment/shipment/${data.data.id}/`,
            shipmentPayload,
          );
        }
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
        await httpService.makeRequest(
          'post',
          `${window.env.API_URL}custodian/custody/`,
          {
            ...startCustody,
            shipment_id: data.data.shipment_uuid,
            shipment: data.data.id,
          },
        );
        if (!_.isEmpty(carriers)) {
          await Promise.all(_.map(carriers, async (carrier, index) => (
            // eslint-disable-next-line no-return-await
            await httpService.makeRequest(
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
            ))));
        }
        await httpService.makeRequest(
          'post',
          `${window.env.API_URL}custodian/custody/`,
          {
            ...endCustody,
            shipment_id: data.data.shipment_uuid,
            shipment: data.data.id,
          },
        );
        if (updateGateway) {
          setTimeout(async () => {
            shipmentPayload = {
              ...data.data,
              gateway_ids: [updateGateway.gateway_uuid],
              gateway_imei: [_.toString(updateGateway.imei_number)],
            };
            const shipment = await httpService.makeRequest(
              'patch',
              `${window.env.API_URL}shipment/shipment/${data.data.id}/`,
              shipmentPayload,
            );
            if (shipment && shipment.data) {
              const gatewayPayload = {
                ...updateGateway,
                gateway_status: 'assigned',
                shipment_ids: shipment.data.partner_shipment_id
                  ? [shipment.data.partner_shipment_id]
                  : [],
              };
              const configureGatewayPayload = {
                platform_type: shipment.data.platform_name,
                gateway: updateGateway.imei_number,
                transmission_interval: shipment.data.transmission_time,
                measurement_interval: shipment.data.measurement_time,
              };
              await httpService.makeRequest(
                'patch',
                `${window.env.API_URL}sensors/gateway/${gatewayPayload.id}`,
                gatewayPayload,
              );
              await httpService.makeRequest(
                'post',
                `${window.env.API_URL}sensors/configure_gateway/`,
                configureGatewayPayload,
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
        displayAlert('success', 'Successfully added shipment');
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
