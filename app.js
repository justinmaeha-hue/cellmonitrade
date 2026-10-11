
'use strict';

// Cellmoney Trade
// Copyright (c) 2026 Buison Maiya.
// All rights reserved.

const AGENT = '67578423441';
const formatK = n => 'K' + n.toFixed(2);
let selected = 0;

const prices = document.getElementById('prices');

for (let amount = 5; amount <= 200; amount += 5) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'price';

  const label = document.createElement('strong');
  label.textContent = formatK(amount);

  const cost = document.createElement('small');
  cost.textContent = 'Pay ' + formatK(amount * 1.1);

  button.append(label, cost);

  button.addEventListener('click', () => {
    selected = amount;

    document.querySelectorAll('.price')
      .forEach(b => b.classList.remove('active'));

    button.classList.add('active');

    document.getElementById('value').textContent =
      formatK(amount);

    document.getElementById('fee').textContent =
      formatK(amount * 0.1);

    document.getElementById('total').textContent =
      formatK(amount * 1.1);
  });

  prices.append(button);
}

function openWhatsApp(message) {
  const link = 'https://wa.me/' + AGENT +
    '?text=' + encodeURIComponent(message);

  window.open(link, '_blank', 'noopener,noreferrer');
}

document.getElementById('orderBtn')
  .addEventListener('click', () => {
    const network =
      document.getElementById('network').value;

    const phone =
      document.getElementById('phone')
        .value.replace(/[\s+\-]/g, '');

    if (!selected) {
      alert('Choose a top-up amount.');
      return;
    }

    if (!network) {
      alert('Choose a network.');
      return;
    }

    if (!/^(675)?7\d{7}$/.test(phone)) {
      alert('Enter a valid PNG mobile number.');
      return;
    }

    const message =
      'Hello Cellmoney Trade!\n\n' +
      'Please confirm this order before payment.\n' +
      'Network: ' + network + '\n' +
      'Phone: ' + phone + '\n' +
      'Top-up: ' + formatK(selected) + '\n' +
      'Fee: ' + formatK(selected * 0.1) + '\n' +
      'Total: ' + formatK(selected * 1.1);

    openWhatsApp(message);
  });

document.getElementById('copyBtn')
  .addEventListener('click', async () => {
    const value =
      document.getElementById('account').textContent;

    const status =
      document.getElementById('copyStatus');

    try {
      await navigator.clipboard.writeText(value);
      status.textContent = 'Account number copied.';
    } catch {
      status.textContent =
        'Please select and copy the account number above.';
    }
  });

document.getElementById('receiptBtn')
  .addEventListener('click', async () => {
    const file =
      document.getElementById('receipt').files[0];

    const status =
      document.getElementById('receiptStatus');

    if (!file) {
      alert('Choose a screenshot first.');
      return;
    }

    if (![
      'image/png',
      'image/jpeg',
      'image/webp'
    ].includes(file.type)) {
      alert('Select a PNG, JPEG or WebP image.');
      return;
    }

    const message =
      'Hello Cellmoney Trade. ' +
      'Please verify my payment receipt.';

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          text: message
        });

        status.textContent =
          'Confirm the recipient and press Send ' +
          'in your chosen app.';
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          status.textContent = 'Sharing cancelled.';
          return;
        }
      }
    }

    status.textContent =
      'WhatsApp will open. Attach your ' +
      'screenshot manually and send it.';

    openWhatsApp(message);
  });
