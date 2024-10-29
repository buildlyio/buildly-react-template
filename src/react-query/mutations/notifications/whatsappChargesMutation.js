import { useMutation } from 'react-query';
import _ from 'lodash';
import { httpService } from '@modules/http/http.service';

export const useWhatsappChargesMutation = (displayAlert) => useMutation(
  async (whatsappChargesData) => {
    const response = await httpService.makeRequestWithoutHeaders(
      'post',
      window.env.WHATSAPP_CHARGES_URL,
      whatsappChargesData,
    );
    return response.data;
  },
  {
    onError: () => {
      displayAlert('error', 'Error in fetching WhatsApp charges');
    },
  },
);
