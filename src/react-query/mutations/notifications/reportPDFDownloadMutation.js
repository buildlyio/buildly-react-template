import { useMutation } from 'react-query';
import _ from 'lodash';
import { httpService } from '@modules/http/http.service';

export const useReportPDFDownloadMutation = (storeData, setStoreData, displayAlert) => useMutation(
  async (reportPDFData) => {
    displayAlert('info', 'PDF Report (Processing. May take several minutes)');
    const response = await httpService.makePostRequestWithoutHeaders(
      'post',
      window.env.EMAIL_REPORT_URL,
      reportPDFData,
    );
    return response.data;
  },
  {
    onSuccess: (data, variables) => {
      const { shipment_name } = variables;
      if (!_.isEmpty(data)) {
        const tempData = {
          shipment_name,
          pdfUrl: data.download_url,
        };
        const existingIndex = _.findIndex(data, { shipment_name });
        let updatedData;
        if (existingIndex !== -1) {
          updatedData = [...storeData];
          updatedData[existingIndex] = tempData;
        } else {
          updatedData = [...storeData, tempData];
        }
        setStoreData(updatedData);
      }
      displayAlert('success', 'You can now download the report');
    },
  },
  {
    onError: () => {
      displayAlert('error', 'Error in creating report');
    },
  },
);
