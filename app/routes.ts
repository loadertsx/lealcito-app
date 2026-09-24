import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("b/:slug", "routes/business.tsx"),
	route("b/:slug/login", "routes/business-login.tsx"),
	route("b/:slug/enter", "routes/business-enter.tsx"),
	route("b/:slug/benefits", "routes/business-benefits.tsx"),
	route("b/:slug/staff", "routes/business-staff.tsx"),
	route("b/:slug/manage", "routes/business-manage.tsx"),
	route("auth/confirm", "routes/auth-confirm.tsx"),
	route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
