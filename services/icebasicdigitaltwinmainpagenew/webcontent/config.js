const config = {
  baseUrl: window.location.hostname,
  serverLocation: window.location.hostname.replace("www.", ""),
  //TODO:- need to add the full URL instead of the path
  webSocketUrl: ":7061/v2/broker/?topics=execution",
  grafanaUrl: "/grafanadirect/",

  basexUrl: "/bpmndirect/rest/Factory_Processes/",
  basexUsername: "admin",
  basexPassword: "admin",

  processviewerUrl: ":7080/front/pe/index.html",

  web3dUrl: ":7081/crane101.html?place=7",

  grafanaUrl:
    ":7066/d/sav8LXomz/process-data-simple?refresh=10s&orgId=1&var-states=All&var-Process=All&var-machines=All&from=now-30m&to=now",

  liveCamUrl: ":7073/factory/webcam.html",
};
