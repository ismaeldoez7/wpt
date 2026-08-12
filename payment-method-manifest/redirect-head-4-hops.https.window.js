// META: spec=https://w3c.github.io/payment-method-manifest/#fetch-pmm
// META: title=Initial HEAD request undergoing 4 redirects aborts fetch (URL list size 5 exceeds limit of 4)
// META: script=/common/utils.js
// META: script=/payment-method-manifest/resources/helpers.js

promise_test(async t => {
  const testId = token();
  const pmiUrl = createPaymentMethodIdentifierUrl(testId, { hops: 4 });

  const request = new PaymentRequest(
    [{ supportedMethods: pmiUrl }],
    { total: { label: 'Total', amount: { currency: 'USD', value: '1.00' } } }
  );

  try {
    await request.canMakePayment();
  } catch (err) {}

  // Wait for initial HEAD requests (at least 1, up to 4 hops)
  const logs = await waitForServerAccessLogs(t, testId, 1);

  assert_true(logs.length >= 1, 'Browser must start HEAD requests');
  const manifestLogs = logs.filter(l => l.endpoint === 'payment-method-manifest');
  assert_equals(manifestLogs.length, 0, 'Exceeding 3 redirects (URL list size > 4) must abort fetch; manifest GET must not occur');
}, 'Initial HEAD request undergoing 4 redirects aborts fetch (URL list size 5 exceeds limit of 4)');
