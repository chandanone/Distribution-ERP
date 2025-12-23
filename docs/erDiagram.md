# ER Diagram -Distribution erp
```
ROLES ||--o{ USERS : has
USERS ||--o{ PURCHASE_ORDERS : creates
USERS ||--o{ GRN : creates
USERS ||--o{ SALES_ORDERS : creates
USERS ||--o{ INVOICES : creates

WAREHOUSES ||--o{ PURCHASE_ORDERS : receives
WAREHOUSES ||--o{ GRN : stores
WAREHOUSES ||--o{ INVENTORY_STOCK : holds
WAREHOUSES ||--o{ SALES_ORDERS : dispatch
WAREHOUSES ||--o{ INVOICES : billing

VENDORS ||--o{ PURCHASE_ORDERS : supplies
VENDORS ||--o{ GRN : linked

CUSTOMERS ||--o{ SALES_ORDERS : places
CUSTOMERS ||--o{ INVOICES : billed
CUSTOMERS ||--o{ PAYMENTS : makes
CUSTOMERS ||--o{ WARRANTY_CARDS : owns
CUSTOMERS ||--o{ SERVICE_JOBS : raises

PRODUCTS ||--o{ PRODUCT_BATCHES : contains
PRODUCTS ||--o{ PURCHASE_ORDER_ITEMS : included_in
PRODUCTS ||--o{ GRN_ITEMS : received
PRODUCTS ||--o{ INVENTORY_STOCK : stocked
PRODUCTS ||--o{ SALES_ORDER_ITEMS : ordered
PRODUCTS ||--o{ INVOICE_ITEMS : billed
PRODUCTS ||--o{ WARRANTY_CARDS : covered
PRODUCTS ||--o{ SERVICE_JOBS : serviced

PURCHASE_ORDERS ||--o{ PURCHASE_ORDER_ITEMS : has
PURCHASE_ORDERS ||--o{ GRN : results_in

GRN ||--o{ GRN_ITEMS : includes

SALES_ORDERS ||--o{ SALES_ORDER_ITEMS : contains
SALES_ORDERS ||--o{ INVOICES : converts_to

INVOICES ||--o{ INVOICE_ITEMS : has
INVOICES ||--o{ PAYMENTS : paid_by
INVOICES ||--o{ TRANSPORT : shipped_by

WARRANTY_CARDS ||--o{ SERVICE_JOBS : references

```
