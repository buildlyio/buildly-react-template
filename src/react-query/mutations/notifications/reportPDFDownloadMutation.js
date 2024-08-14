import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useReportPDFDownloadMutation = (displayAlert) => useMutation(
  async (reportPDFData) => {
    const response = await httpService.makePostRequestWithoutHeaders(
      'post',
      window.env.EMAIL_REPORT_URL,
      reportPDFData,
    );
    return response.data;
  },
  {
    onSuccess: () => {
      displayAlert('success', 'Report sent on email successfully');
    },
  },
  {
    onError: () => {
      displayAlert('error', 'Error in creating report');
    },
  },
);
