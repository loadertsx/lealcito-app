import {
	index,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	// Customer-facing routes
	index("routes/customer/home.tsx"),
	route("b/:slug", "routes/customer/business.tsx"),
	route("b/:slug/enter", "routes/customer/business-enter.tsx"),
	route("b/:slug/benefits", "routes/customer/business-benefits.tsx"),

	// Business administration and staff routes
	...prefix("admin", [
		route("b/:slug/staff", "routes/admin/business-staff.tsx"),
		route("b/:slug/manage", "routes/admin/business-manage.tsx"),
	]),

	// Authentication shared by customers, owners, and staff
	route("b/:slug/login", "routes/auth/business-login.tsx"),
	route("auth/confirm", "routes/auth/auth-confirm.tsx"),
	route("logout", "routes/auth/logout.tsx"),
] satisfies RouteConfig;
