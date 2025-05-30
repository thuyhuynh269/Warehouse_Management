import * as request from '../../utils/request';

export const getClientId = async () => {
    let clientId
    await request
      .get("Auth/google-client-id")
      .then((response) => {
        clientId = response.clientId
      })
      .catch((error) => {
        console.log(error);
        return
      });

    return clientId
}