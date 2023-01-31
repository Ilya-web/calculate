

document.addEventListener("DOMContentLoaded", () => {

  //providers ------------------------------------------------
  const providers = [
    {
      name: 'backblaze',
      maxFree: 0,
      colorBar: '#ff0000',
      minPayment: 7,
      storage:
        [
          {
            name: 'default',
            price: 0.005,
          },
        ],
      transfer: 0.01,
    },
    {
      name: 'bunny',
      maxFree: 0,
      colorBar: '#ff9900',
      maxPayment: 10,
      storage: [
        {
          name: 'hdd',
          price: 0.01,
        },
        {
          name: 'ssd',
          price: 0.02,
        }
      ],
      transfer: 0.01,
    },
    {
      name: 'scaleway',
      maxFree: 75,
      colorBar: '#ff00ff',
      storage:[
        {
          name: 'multi',
          price: 0.06
        },
        {
          name: 'single',
          price: 0.03
        }
      ],
      transfer: 0.02,
    },
    {
      name: 'vultr',
      maxFree: 0,
      colorBar: '#4a86e8',
      minPayment: 5,
      storage:  [
        {
          name: 'default',
          price: 0.01,
        },
      ],
      transfer: 0.01,
    },
  ]

  // maxPrice for bar -------------------------------------------------
  const storageInput = document.getElementById('storageInput');
  const transferInput= document.getElementById('transferInput');
  const storageRangeMax = document.getElementById('storageRangeMax');
  const transferRangeMax = document.getElementById('transferRangeMax');
  const storageValue = document.getElementById('storageValue');
  const transferValue = document.getElementById('transferValue');
  storageRangeMax.innerText = storageInput.max;
  transferRangeMax.innerText = transferInput.max;
  storageValue.innerText = storageInput.value;
  transferValue.innerText = transferInput.value;

  const maxPrice = providers.reduce((maxP,provider) => {
    const storageMaxPrice =  Math.max(...provider.storage.map(i => i.price))
    return storageMaxPrice > maxP ? storageMaxPrice : maxP;
  },0)

  const maxTransfer = providers.reduce((acc, curr) => acc.transfer > curr.transfer ? acc : curr)

  const maxFree = providers.reduce((acc, curr) => acc.maxFree > curr.maxFree ? acc : curr)

  const maxTotal = maxPrice * (storageInput.max  - maxFree.maxFree) + maxTransfer.transfer * (transferInput.max - maxFree.maxFree)

  // inputRange ----------------------------------------------------------------
  const inputRange = document.querySelectorAll('.range')
  inputRange.forEach(input => {
    input.addEventListener('input', (event) => {
      input.querySelector('.range_count').textContent = event.target.value;
      setTimeout(function (){
        calculate(event.target.value)
      },200)
    })
  })


  //markup provider-------------------------------------------------------------
  const providersBox = document.querySelector('.providers');
  let markup = ``;

  providers.forEach(provider => {
    markup += `<div class="provider-item" 
                  data-storage-price="${provider.storage[0].price}" 
                  data-transfer-price="${provider.transfer}"
                  ${provider.maxFree ? `data-free-gb=${provider.maxFree}` : ''}
                  >
                    <div class="provider-item_head">
                        <div class="provider-item_desc">
                            <div class="provider-item_name">${provider.name}</div>
                            <div class="provider-item_storageTypes">
                              ${provider.storage.length > 1 ? provider.storage.map((p, i) => {
                                  const active = i === 0 ? 'active' : '';
                                  return `<button type="button" class="${active}" data-price="${p.price}">${p.name}</button>`
                                })
                                : ''
                              }
                    </div>
                </div>
                <div class="provider-item_img">icon</div>
            </div>
            
            <div class="provider-item_bar" >
              <div class="provider-item_scale" style="width: 50px; background: ${provider.colorBar}">
                <div class="provider-item_scale__count" 
                    id="${provider.name}" 
                    ${provider.minPayment ? `data-min-price=${provider.minPayment}` : ''}
                    ${provider.maxPayment ? `data-max-price=${provider.maxPayment}` : ''}
                   >
                   <span>${provider.minPayment ? (provider.minPayment || provider.maxPayment) : 0}</span>$

                </div>
              </div>
            </div>
       </div>`
  })

  providersBox.innerHTML = markup;


  //button add class active-------------------------------------------------------
  const storageTypes = document.querySelectorAll('.provider-item_storageTypes button');

  storageTypes.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentBtn = btn.parentElement;
      const btns = parentBtn.querySelectorAll('.provider-item_storageTypes button');
      const dataPriceValue = btn.getAttribute('data-price');

      btns.forEach(i => {
        i.classList.remove('active');
      });

      btn.classList.add('active')
      btn.closest('.provider-item').setAttribute('data-storage-price', dataPriceValue);

      setTimeout(function () {
        calculate();
      },200)
    })
  })


  //calculate----------------------------------------------------------------------
  const providerItem = document.querySelectorAll('.provider-item');
  const calculate = () => {

    const arrTotalValues = []

    providerItem.forEach(provider => {

      let storageItemPrice = Number(provider.getAttribute('data-storage-price'));
      let transferItemPrice = Number(provider.getAttribute('data-transfer-price'));
      const freeGBItemPrice = Number(provider.getAttribute('data-free-gb'));
      const withBar = provider.querySelector('.provider-item_scale');
      const minPayment = Number(provider.querySelector('.provider-item_scale__count').getAttribute('data-min-price'));
      const maxPayment = Number(provider.querySelector('.provider-item_scale__count').getAttribute('data-max-price'));
      const storageCount = Number((storageInput.value * storageItemPrice).toFixed(2));
      const transferCount = Number((transferInput.value * transferItemPrice).toFixed(2));
      const total = storageCount + transferCount;
      const value = provider.querySelector('.provider-item_scale__count span');

      let totalValue = null;

      totalValue = total.toFixed(2);

      if(minPayment !== 0 && minPayment > total) {
        totalValue = minPayment.toFixed(2);
      }
      if(maxPayment !== 0 && maxPayment < total) {
        totalValue = maxPayment.toFixed(2);
      }
      if(freeGBItemPrice !== 0) {
        let storage = (storageInput.value - freeGBItemPrice) * storageItemPrice;
        let transfer = (transferInput.value - freeGBItemPrice) * transferItemPrice;
        let total = ((storage < 0 ? 0 : storage) + (transfer < 0 ? 0 : transfer))
        totalValue = (total > 0 ? total : 0).toFixed(2);
      }
      arrTotalValues.push(Number(totalValue))
      value.innerHTML = totalValue;

      const bar = Number(provider.querySelector('.provider-item_scale__count span').innerHTML) / maxTotal * 100;
      withBar.style.width = `${bar}%`;

    })

    const min = Math.min(...arrTotalValues);
    const arrOfIndexes = arrTotalValues.reduce((acc, val, i) => val === min ? [...acc, i] : acc, [])

    providerItem.forEach(i => {
      i.classList.remove('small')
      arrOfIndexes.forEach(i => {
        providerItem[i].classList.add('small')
      })
    })
  }

  calculate()

});
