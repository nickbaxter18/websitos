export default {
  flag: "server_tagging",
  async apply(html: string) {
    const s = `<script>(function(){
    window.udigitEmit=function(type,payload){
      try{
        const uid=localStorage.getItem("uid")||""; 
        const consent=localStorage.getItem("consent_choice_v2")||"unknown";
        const body=JSON.stringify({type,payload,uid,ts:Date.now(),consent});
        navigator.sendBeacon && navigator.sendBeacon("/events", new Blob([body],{type:"application/json"}));
      }catch(e){}
    };
  })();</script>`;
    return html.replace("</body>", s + "</body>");
  },
};
