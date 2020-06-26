using System.Web.Http;

namespace MapService
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {            
            config.EnableCors();            
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "settings/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );            
        }
    }
}
