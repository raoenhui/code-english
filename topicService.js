const Jsf = require('@jd/jmfe-node-jsf');

// class TopicService extends Service {
class TopicService {
  async getUserTicket(username, password) {
    try {
      const jsf = new Jsf('g.jsf.jd.local');
      const ticket = await jsf.post({
        className: 'com.jd.ssa.service.SsoService',
        aliasName: 'v1',
        functionId: 'getTicketByPwd',
        appId: '34803',
        // params: [username, this.helper.md5(password), 'babel.m.jd.com', 12 * 3600]
        params: [username, password, 'babel.m.jd.com', 12 * 3600]
      });
      console.info('ticket',ticket)
      if(ticket) {
        return JSON.parse(ticket);
      }
    } catch(err) {
      // this.logger.error('获取ticket失败', err);
      console.log('获取ticket失败', err)
    }
    return null;
  }
}

module.exports = new TopicService();
// export default new TopicService();
