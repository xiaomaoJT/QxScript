let obj = JSON.parse($response.body);

let sub = [
  {
    id: "11111111-2222-3333-4444-555555555555",
    status: "trial",
    autorenew_enabled: true,
    in_retry_billing: false,
    expires_at: "2222-02-02T02:22:00.000Z",
    cancelled_at: null,
    retries_count: 0,
    started_at: "2023-12-03T05:15:00.000Z",
    unit: "",
    units_count: "",
    active_till: "2222-02-02T02:22:00.000Z",
    product_id: "sub_yeart_nightvision",
    introductory_activated: true,
    kind: "autorenewable",
    platform: "ios",
  },
];
obj.data.results.subscriptions = sub;
$done({ body: JSON.stringify(obj) });
