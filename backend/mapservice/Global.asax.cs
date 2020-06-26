using System.Web.Http;
using System.Web.Routing;

namespace MapService
{
    public class WebApiApplication : System.Web.HttpApplication
    {		
		protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            GlobalConfiguration.Configure(WebApiConfig.Register);
			RouteConfig.RegisterRoutes(RouteTable.Routes);					
		}
    }
}
