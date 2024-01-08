import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddShipmentTemplateMutation = (organization, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (shipmentTemplateData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}shipment/shipment_template/`,
        shipmentTemplateData,
      );
      return response.data;
    },
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries({
          queryKey: ['shipmentTemplates', organization],
        });
        displayAlert('success', `Successfully added template ${res.name}`);
      },
      onError: () => {
        displayAlert('error', 'Error in creating shipment template');
      },
    },
  );
};
