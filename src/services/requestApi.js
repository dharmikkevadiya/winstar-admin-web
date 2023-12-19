import http from './http-common'

class DataService {
  // Auth
  Login(data) {
    return http.post('/auth/login', data)
  }

  Signup(data) {
    return http.post('/auth/signup', data)
  }

  getMe(token) {
    return http.get('/auth/profile/get/me', {
      headers: {
        token: token
      }
    })
  }

  callGetPermissionArr() {
    return http.get('/auth/permissionArr')
  }

  callGetStatistics(token) {
    return http.get('/auth/allCounters', {
      headers: {
        token: token
      }
    })
  }
  callGetPlayersCountByCountryState(query, token) {
    return http.get(`/auth/playersCountByCountryState?${query}`, {
      headers: {
        token: token
      }
    })
  }

  callGetAllAdmins(token) {
    return http.get('/auth/allAdmins', {
      headers: {
        token: token
      }
    })
  }

  callEditAdmin(id, data, token) {
    return http.patch(`/auth/profile/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadAdminPhoto(id, data, token) {
    return http.post(`/auth/profile/${id}/uploadPhoto`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveAdmin(id, token) {
    return http.delete(`/auth/profile/${id}`, {
      headers: {
        token: token
      }
    })
  }

  // banner
  callGetAllBanner(token) {
    return http.get('/banners', {
      headers: {
        token: token
      }
    })
  }
  callRemoveBanner(id, token) {
    return http.delete(`/banners/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callEditBanner(id, data, token) {
    return http.patch(`/banners/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadBannerImage(id, data, token) {
    return http.post(`/banners/${id}/upload`, data, {
      headers: {
        token: token
      }
    })
  }
  callAddBanner(data, token) {
    return http.post(`/banners`, data, {
      headers: {
        token: token
      }
    })
  }

  // players
  callGetPlayersList(token) {
    return http.get('/players/get/all', {
      headers: {
        token: token
      }
    })
  }
  callGetPlayersEmailList(token) {
    return http.get('/players/get/emailList', {
      headers: {
        token: token
      }
    })
  }
  callGetPlayersListForNotification(token) {
    return http.get('/players/get/forNotification', {
      headers: {
        token: token
      }
    })
  }
  callGetPlayerById(id, token) {
    return http.get(`/players/${id}`, {
      headers: {
        token: token
      }
    })
  }

  callGetPlayersListByQuery(query, token) {
    return http.get(`/players/get/all/?${query}`, {
      headers: {
        token: token
      }
    })
  }
  callRemovePlayer(id, token) {
    return http.delete(`/players/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callEditPlayer(id, data, token) {
    return http.patch(`/players/${id}`, data, {
      headers: {
        token: token
      }
    })
  }

  //banks

  callGetPlayersBanks(id, token) {
    return http.get(`/players/${id}/getBanks`, {
      headers: {
        token: token
      }
    })
  }
  callUpdatePlayersBank(id, data, token) {
    return http.patch(`/players/${id}/updateBank`, data, {
      headers: {
        token: token
      }
    })
  }

  // games
  callGetAllGames(token) {
    return http.get('/games', {
      headers: {
        token: token
      }
    })
  }
  callRemoveGame(id, token) {
    return http.delete(`/games/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callEditGame(id, data, token) {
    return http.patch(`/games/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadGameImage(id, data, token) {
    return http.post(`/games/${id}/upload`, data, {
      headers: {
        token: token
      }
    })
  }
  callAddGame(data, token) {
    return http.post(`/games`, data, {
      headers: {
        token: token
      }
    })
  }

  // setting
  callGetSettings(token) {
    return http.get('/settings', {
      headers: {
        token: token
      }
    })
  }
  callUpdateSettings(data, token) {
    return http.patch('/settings', data, {
      headers: {
        token: token
      }
    })
  }
  callGetCurrency(token) {
    return http.get(`/settings/getCurrency`, {
      headers: {
        token: token
      }
    })
  }
  callAddCurrency(data, token) {
    return http.post(`/settings/addCurrency`, data, {
      headers: {
        token: token
      }
    })
  }
  callEditCurrency(data, token) {
    return http.put(`/settings/editCurrency`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveCurrency(data, token) {
    return http.post(`/settings/removeCurrency`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadCurrencyIcon(id, data, token) {
    return http.post(`/settings/uploadCurrencyIcon/${id}`, data, {
      headers: {
        token: token
      }
    })
  }

  // contact us
  callGetSubmissions(token) {
    return http.get('/contactUs', {
      headers: {
        token: token
      }
    })
  }
  callUpdateSubmissions(id, data, token) {
    return http.patch(`/contactUs/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveSubmissions(id, token) {
    return http.delete(`/contactUs/${id}`, {
      headers: {
        token: token
      }
    })
  }

  // tickets
  callGetTickets(token) {
    return http.get('/tickets', {
      headers: {
        token: token
      }
    })
  }
  callCreateTicket(data, token) {
    return http.post(`/tickets`, data, {
      headers: {
        token: token
      }
    })
  }
  callGetTicketById(id, token) {
    return http.get(`/tickets/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callUpdateTicket(id, data, token) {
    return http.patch(`/tickets/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadTicketImage(id, data, token) {
    return http.post(`/tickets/${id}/uploadIssueImage`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveTicket(id, token) {
    return http.delete(`/tickets/${id}`, {
      headers: {
        token: token
      }
    })
  }

  // socials
  callGetSocialLinks(token) {
    return http.get('/socials', {
      headers: {
        token: token
      }
    })
  }
  callUpdatSocialLinks(data, token) {
    return http.patch(`/socials`, data, {
      headers: {
        token: token
      }
    })
  }

  // history
  callGetHistory(type, playerId, token) {
    return http.get(`/history/transactions/?note=${type}&playerId=${playerId}`, {
      headers: {
        token: token
      }
    })
  }
  callCreateTestTransaction(data, token) {
    return http.post(`/history/createTestTransaction`, data, {
      headers: {
        token: token
      }
    })
  }
  callGetReferralHistory(playerId, token) {
    return http.get(`/players/get/referralHistory/?playerId=${playerId}`, {
      headers: {
        token: token
      }
    })
  }

  // versions
  callGetVersions(token) {
    return http.get('/versions', {
      headers: {
        token: token
      }
    })
  }
  callUpdatVersion(data, token) {
    return http.patch(`/versions`, data, {
      headers: {
        token: token
      }
    })
  }

  // notification
  callGetAllNotification(token) {
    return http.get('/notifications', {
      headers: {
        token: token
      }
    })
  }
  callGetNotificationById(id, token) {
    return http.get(`/notifications/${id}`, {
      headers: {
        token: token
      }
    })
  }

  callUpdateNotification(id, data, token) {
    return http.patch(`/notifications/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callSendNotification(data, token) {
    return http.post(`/notifications/send`, data, {
      headers: {
        token: token
      }
    })
  }

  callRemoveNotification(id, token) {
    return http.delete(`/notifications/${id}`, {
      headers: {
        token: token
      }
    })
  }

  // spin wheel
  callGetAllSpinWheel(token) {
    return http.get('/spinWheels', {
      headers: {
        token: token
      }
    })
  }
  callRemoveSpinWheel(id, token) {
    return http.delete(`/spinWheels/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callEditSpinWheel(id, data, token) {
    return http.patch(`/spinWheels/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callAddSpinWheel(data, token) {
    return http.post(`/spinWheels`, data, {
      headers: {
        token: token
      }
    })
  }

  // RestrictedArea
  callGetAllRestrictedArea(token) {
    return http.get('/restrictedAreas', {
      headers: {
        token: token
      }
    })
  }
  callRemoveRestrictedArea(id, token) {
    return http.delete(`/restrictedAreas/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callEditRestrictedArea(id, data, token) {
    return http.patch(`/restrictedAreas/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callAddRestrictedArea(data, token) {
    return http.post(`/restrictedAreas`, data, {
      headers: {
        token: token
      }
    })
  }

  // game providers
  callGetAllGameProvider(token) {
    return http.get('/gameProviders', {
      headers: {
        token: token
      }
    })
  }
  callAddGameProvider(data, token) {
    return http.post(`/gameProviders`, data, {
      headers: {
        token: token
      }
    })
  }
  callEditGameProvider(id, data, token) {
    return http.patch(`/gameProviders/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveGameProvider(id, token) {
    return http.delete(`/gameProviders/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callUploadGameProviderBannerImage(id, data, token) {
    return http.post(`/gameProviders/${id}/uploadBanner`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadGameProviderIconImage(id, data, token) {
    return http.post(`/gameProviders/${id}/uploadIcon`, data, {
      headers: {
        token: token
      }
    })
  }

  // game types
  callGetAllGameType(token) {
    return http.get('/gameTypes', {
      headers: {
        token: token
      }
    })
  }
  callAddGameType(data, token) {
    return http.post(`/gameTypes`, data, {
      headers: {
        token: token
      }
    })
  }
  callEditGameType(id, data, token) {
    return http.patch(`/gameTypes/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveGameType(id, token) {
    return http.delete(`/gameTypes/${id}`, {
      headers: {
        token: token
      }
    })
  }

  // game types
  callGetAllGameSubtype(token) {
    return http.get('/gameSubtypes', {
      headers: {
        token: token
      }
    })
  }
  callAddSubtype(data, token) {
    return http.post(`/gameSubtypes`, data, {
      headers: {
        token: token
      }
    })
  }
  callEditSubtype(id, data, token) {
    return http.patch(`/gameSubtypes/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveSubtype(id, token) {
    return http.delete(`/gameSubtypes/${id}`, {
      headers: {
        token: token
      }
    })
  }

  // cms
  callGetAllCMS(token) {
    return http.get('/cms', {
      headers: {
        token: token
      }
    })
  }
  callRemoveCMS(id, token) {
    return http.delete(`/cms/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callEditCMS(id, data, token) {
    return http.patch(`/cms/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadCMSImage(id, data, token) {
    return http.post(`/cms/${id}/upload`, data, {
      headers: {
        token: token
      }
    })
  }
  callAddCMS(data, token) {
    return http.post(`/cms`, data, {
      headers: {
        token: token
      }
    })
  }

  // blog
  callGetAllBlog(token) {
    return http.get('/blogs', {
      headers: {
        token: token
      }
    })
  }
  callRemoveBlog(id, token) {
    return http.delete(`/blogs/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callEditBlog(id, data, token) {
    return http.patch(`/blogs/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callUploadBlogImage(id, data, token) {
    return http.post(`/blogs/${id}/uploadImage`, data, {
      headers: {
        token: token
      }
    })
  }
  callAddBlog(data, token) {
    return http.post(`/blogs`, data, {
      headers: {
        token: token
      }
    })
  }

  // faqs
  callGetFAQList(token) {
    return http.get('/faqs', {
      headers: {
        token: token
      }
    })
  }
  callCreateFAQ(data, token) {
    return http.post('/faqs', data, {
      headers: {
        token: token
      }
    })
  }
  callEditFAQ(id, data, token) {
    return http.patch(`/faqs/${id}`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveFAQ(id, token) {
    return http.delete(`/faqs/${id}`, {
      headers: {
        token: token
      }
    })
  }
  callGetFAQById(id, token) {
    return http.get(`/faqs/${id}`, {
      headers: {
        token: token
      }
    })
  }

  // Faqs: qAndA
  callAddQAndA(id, data, token) {
    return http.post(`/faqs/${id}/qAndA`, data, {
      headers: {
        token: token
      }
    })
  }
  callRemoveQAndA(id, data, token) {
    return http.put(`/faqs/${id}/qAndA`, data, {
      headers: {
        token: token
      }
    })
  }
  callEditQAndA(id, data, token) {
    return http.patch(`/faqs/${id}/qAndA`, data, {
      headers: {
        token: token
      }
    })
  }
}
const DataServices = new DataService()

export default DataServices
