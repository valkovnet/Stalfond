<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="Virtu.Service" %>
<%@ Import Namespace="Virtu.Web.Security" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Stalfond</title>

    <script>
        var Ext = Ext || {};
        Ext.theme = {
            name: ""
        };
    </script>    

    <script src="http://cdn.sencha.com/ext/gpl/5.0.1/build/ext-all.js"></script>
    <script src="http://cdn.sencha.com/ext/gpl/5.0.1/build/packages/ext-theme-crisp/build/ext-theme-crisp.js"></script>
    <link rel="stylesheet" href="http://cdn.sencha.com/ext/gpl/5.0.1/build/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all.css">

    <script type="text/javascript" src="api.vlib"></script>
    <script type="text/javascript" src="Resources/Scripts/Framework.js"></script>

    <!--script type="text/javascript" src="Resources/Scripts/common.js"></script-->

    <script type="text/javascript" http-equiv="cache-control" content="must-revalidate"  src="Resources/Scripts/linq.js"></script>
    
    <link rel="stylesheet" href="stylesheet.css">
    <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>

    <script type="text/javascript" src="Resources/Scripts/InputTextMask.js"></script>     
    <script type="text/javascript" src="Resources/Scripts/functions.js"></script>     
    <!--script type="text/javascript" src="Resources/Plugins/address.js"></script-->
    
    <script type="text/javascript">

        Ext.Direct.on('exception', function (error) {
            Ext.Msg.alert('Ошибка на стороне сервера.', error.message);
        });

        Ext.Direct.addProvider(DirectHelper);
        
    </script>

    <script type="text/javascript" src="app.js"></script>
    

    
  
  </head>
<body>
    <table cellpadding="0" cellspacing="5" border="0" style="width: 100%">
        <tr>
            <td style="width: 30%">
                The Stalfond application
            </td>
            <td>
            <!--<img src="Resources/Images/large-loading.gif" id="loadImg" style="display:none;"/>-->
                <div id="dMain" />
            </td>
            <td style="width: 30%">
            </td>
        </tr>
    </table>
</body>
</html>
