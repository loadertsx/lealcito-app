-- Existing memberships imply the customer had already entered that business.
-- Keep the membership's original join time rather than marking them as new today.
INSERT INTO business_customers (user_id, business_id, entered_at)
SELECT user_id, business_id, joined_at
FROM business_memberships
WHERE 1
ON CONFLICT (user_id, business_id) DO NOTHING;