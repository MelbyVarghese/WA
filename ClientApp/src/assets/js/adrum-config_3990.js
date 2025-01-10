var EUMURL = '';
var APM_Appkey = '';
switch (window.location.hostname.toLowerCase()){
  case 'onecognizantaks.cognizant.com':
  case 'onecognizantaksbcapps.cognizant.com':
    EUMURL = 'col.eum-appdynamics.com';
    APM_Appkey = 'AD-AAB-ACT-RBF';//prod
    break;
  default:
    EUMURL = 'bom-col.eum-appdynamics.com'
    APM_Appkey = 'BO-AAB-FCN'; //Non-prod
    break;
}
var APM_AppID = '3990';
var APM_AppName = 'CognizantOn';
var APM_AppType = '1C HomeGrown'; //1C Platform_AKS,1C Native Critical_AKS,1C Native Non-Critical_AKS
var APM_Portfolio = 'HR IT';
var ApplicationAdrumExtURL_HTTP = 'http://' + window.location.hostname + '/3990/AdminModule/assets/js';   //Adrum_Ext Script Path
var ApplicationAdrumExtURL_HTTPS = 'https://' + window.location.hostname + '/3990/AdminModule/assets/js'; //Adrum_Ext Script Path
var EUMURL_HTTP = 'http://' + EUMURL;    // EUM URL
var EUMURL_HTTPS = 'https://' + EUMURL;  // EUM URL
var APM_hiddenFieldName_UserInfo = 'APM_AssociateInfo';   //It should not be change
var APM_hiddenFieldName = '';   // Provide HiddenFiledName (APM_UserId) if AssociateID is there in Hidden Field, otherwise it should be empty
var APM_responseHeaderName = 'aksuser';   // Provide Response Header Name (camsuser) if AssociateID is there in Response Header, otherwise it should be empty

//Below variables should be empty
var APM_GradeCode = '';
var APM_BU = '';
var APM_DepartmentName = '';
var APM_AssociateID = '';

function encrypt(a) {
    var b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\\1234567890%~#$-*"; //<!-- letters to compare to -->
    var c = "\\0987654321zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA+!()?@"; //<!-- letter to change string to -->
    var d;
    var h;
    var i;
    var j = "";

    var f = a.length; //<!-- get length of the textbox1 string -->
    var e = 0;
    var g = 1;

    while (e != f) { //<!-- while e is not equal to the string length loop -->
        d = a.substring(e, g); //<!-- get each letter in the text box -->
        h = b.indexOf(d); //<!-- find that letter in var b -->
        i = c.charAt(h); //<!-- change it to the letter in var c -->
        e++; //<!-- add one to var e -->
        g++; //<!-- add one to var g -->
        j += i; //<!-- write out each letter -->
    }
    return j; //<!-- the final output put in textbox2 -->
}

function decrypt(aa) {
    //var aa = form1.second.value;
    var bb = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\\1234567890%~#$-*";
    var cc = "\\0987654321zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA+!()?@";
    var dd;
    var hh;
    var ii;
    var jj = "";

    var ff = aa.length;
    var ee = 0;
    var gg = 1;

    while (ee != ff) {
        dd = aa.substring(ee, gg);
        hh = cc.indexOf(dd); //<!-- just switch var b with c to unencode ex(h = b.indexOf(d); now  ='s hh = cc.indexOf(dd);)-->
        ii = bb.charAt(hh); //<!-- just switch var c with b to unencode  -->
        ee++;
        gg++;
        jj += ii;
    }

    return jj;
}

function EUM_getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}
function APM_getAssociateID() {
    try {
        var EUM_SessionID = EUM_getCookie("EUM_SessionID");
        if (EUM_SessionID != undefined && EUM_SessionID != null && EUM_SessionID != '') {
            EUM_SessionID = decrypt(EUM_SessionID);
        }
        else if (sessionStorage.getItem("EUM_SessionID1") != null && sessionStorage.getItem("EUM_SessionID1") != undefined && sessionStorage.getItem("EUM_SessionID1") != '') {
            EUM_SessionID = decrypt(sessionStorage.getItem("EUM_SessionID1"));
        }
        else if (APM_hiddenFieldName != undefined && APM_hiddenFieldName != '') {
            var userId = document.getElementById(APM_hiddenFieldName);
            if (userId != undefined && userId != null && userId.value != '') {
                EUM_SessionID = userId.value.toLowerCase().replace("cts\\", "");
                document.cookie = "EUM_SessionID=" + encrypt(EUM_SessionID) + ";Domain=.cognizant.com;path=/";
                sessionStorage.setItem("EUM_SessionID1", encrypt(EUM_SessionID));
            }
        }
        else if (APM_responseHeaderName != undefined && APM_responseHeaderName != '') {
            var httpRequest = new XMLHttpRequest();
            httpRequest.open("GET", document.location, false);
            httpRequest.send();
            EUM_SessionID = httpRequest.getResponseHeader(APM_responseHeaderName);
            EUM_SessionID = EUM_SessionID.toLowerCase().replace("cts\\", "");
            document.cookie = "EUM_SessionID=" + encrypt(EUM_SessionID) + ";Domain=.cognizant.com;path=/";
            sessionStorage.setItem("EUM_SessionID1", encrypt(EUM_SessionID));
        }

        APM_AssociateID = EUM_SessionID;

        var EUM_SessionInfo = EUM_getCookie("EUM_SessionInfo");
        if (EUM_SessionInfo != undefined && EUM_SessionInfo != null && EUM_SessionInfo != '') {
            EUM_SessionInfo = decrypt(EUM_SessionInfo);
        }
        else if (sessionStorage.getItem("EUM_SessionInfo1") != null && sessionStorage.getItem("EUM_SessionInfo1") != undefined && sessionStorage.getItem("EUM_SessionInfo1") != '') {
            EUM_SessionInfo = decrypt(sessionStorage.getItem("EUM_SessionInfo1"));
        }
        else {
            var userInfo = document.getElementById(APM_hiddenFieldName_UserInfo);
            if (userInfo != undefined && userInfo != null && userInfo.value != '') {
                EUM_SessionInfo = userInfo.value;
                document.cookie = "EUM_SessionInfo=" + encrypt(EUM_SessionInfo) + ";Domain=.cognizant.com;path=/";
                sessionStorage.setItem("EUM_SessionInfo1", encrypt(EUM_SessionInfo));
            }
        }

        if (EUM_SessionInfo != undefined && EUM_SessionInfo != null && EUM_SessionInfo != '') {
            var EUM_SessionInfo_Array = EUM_SessionInfo.split("~~");
            if (EUM_SessionInfo_Array.length > 0) {
                APM_GradeCode = EUM_SessionInfo_Array[0];
            }

            if (EUM_SessionInfo_Array.length > 1) {
                APM_BU = EUM_SessionInfo_Array[1];
            }

            if (EUM_SessionInfo_Array.length > 2) {
                APM_DepartmentName = decodeURIComponent(EUM_SessionInfo_Array[2]);
            }
        }
    }
    catch (e) {
    }
}
window['adrum-start-time'] = new Date().getTime();
window['adrum-config'] = {
    userEventInfo: {
        "PageView": function (context) {
            APM_getAssociateID();
            return {
                userData: {
                    AssociateID: APM_AssociateID,
                    AppID: APM_AppID,
                    AppName: APM_AppName,
                    AppType: APM_AppType,
                    Portfolio: APM_Portfolio,
                    GradeCode: APM_GradeCode,
                    BU: APM_BU,
                    DepartmentName: APM_DepartmentName
                }
            }
        },
        "Ajax": function (context) {
            APM_getAssociateID();
            return {
                userData: {
                    AssociateID: APM_AssociateID,
                    AppID: APM_AppID,
                    AppName: APM_AppName,
                    AppType: APM_AppType,
                    Portfolio: APM_Portfolio,
                    GradeCode: APM_GradeCode,
                    BU: APM_BU,
                    DepartmentName: APM_DepartmentName
                }
            }
        },
        "VPageView": function (context) {
            APM_getAssociateID();
            return {
                userData: {
                    AssociateID: APM_AssociateID,
                    AppID: APM_AppID,
                    AppName: APM_AppName,
                    AppType: APM_AppType,
                    Portfolio: APM_Portfolio,
                    GradeCode: APM_GradeCode,
                    BU: APM_BU,
                    DepartmentName: APM_DepartmentName
                }
            }
        }
    }
};
(function (config) {
    config.appKey = APM_Appkey;
    config.adrumExtUrlHttp = ApplicationAdrumExtURL_HTTP;
    config.adrumExtUrlHttps = ApplicationAdrumExtURL_HTTPS;
    config.beaconUrlHttp = EUMURL_HTTP;
    config.beaconUrlHttps = EUMURL_HTTPS;
    config.xd = { enable: true };
})(window['adrum-config'] || (window['adrum-config'] = {}));
