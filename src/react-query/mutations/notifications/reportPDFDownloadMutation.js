import { useMutation, useQueryClient } from 'react-query';
import _ from 'lodash';
import { httpService } from '@modules/http/http.service';

export const useReportPDFDownloadMutation = (
  shipmentFilter,
  locShipmentID,
  organization,
  displayAlert,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (reportPDFData) => {
      displayAlert('info', 'PDF Report (Processing may take several minutes)');
      const response = await httpService.makeRequestWithoutHeaders(
        'post',
        window.env.EMAIL_REPORT_URL,
        reportPDFData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        displayAlert('success', 'You can now download the report');
        await queryClient.invalidateQueries({
          queryKey: ['shipments', shipmentFilter, locShipmentID, organization],
        });
      },
      onError: () => {
        displayAlert('error', 'Error in creating report');
      },
    },
  );
};
