'use strict';

// =====================================================
// ARC LABS DAPP JS
// =====================================================

// ---------------- NETWORK ----------------

const ARC_CHAIN_ID = 5042002;

// ---------------- TOKENS ----------------

const TOKENS = [
  {
    symbol: 'USDC',
    decimals: 6,
    color: '#2775ca',
    label: 'U',
    balance: '1,250.00'
  },

  {
    symbol: 'EURC',
    decimals: 6,
    color: '#16b67f',
    label: 'E',
    balance: '850.00'
  },

  {
    symbol: 'WETH',
    decimals: 18,
    color: '#627eea',
    label: 'W',
    balance: '4.20'
  }
];

// ---------------- STATE ----------------

let provider = null;
let signer = null;
let account = null;

let fromToken = TOKENS[0];
let toToken = TOKENS[1];

let slippage = 0.5;

// =====================================================
// PAGE SWITCH
// =====================================================

function switchPage(pageId){

  document.querySelectorAll('.page').forEach(page=>{
    page.style.display = 'none';
  });

  const targetPage =
    document.getElementById('page-' + pageId);

  if(targetPage){
    targetPage.style.display = 'block';
  }

}

// =====================================================
// NAV ACTIVE
// =====================================================

function setActive(el){

  document.querySelectorAll('.nav-links a').forEach(link=>{
    link.classList.remove('active');
  });

  el.classList.add('active');

}

// =====================================================
// CONNECT WALLET
// =====================================================

async function connectWallet(){

  if(!window.ethereum){

    alert('MetaMask not installed');

    return;
  }

  try{

    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();

    account = await signer.getAddress();

    console.log("CONNECTED:", account);

    const btn =
      document.querySelector('.btn-connect');

    btn.innerText =
      account.slice(0,6) +
      "..." +
      account.slice(-4);

    updateSwapBtn();

  }catch(err){

    console.log(err);

    alert('Wallet connection failed');

  }

}

// =====================================================
// CALCULATE OUTPUT
// =====================================================

function calcOutput(){

  const amt =
    parseFloat(
      document.getElementById('amtIn').value || 0
    );

  if(amt <= 0){

    document.getElementById('amtOut').value = '';

    document.getElementById('rateDisp').textContent = '-';

    document.getElementById('minRecv').textContent = '-';

    updateSwapBtn();

    return;
  }

  // fake rate
  const rate = 0.9214;

  const gross = amt * rate;

  // 0.3% fee
  const afterFee = gross * (1 - 0.003);

  // slippage
  const minOut =
    afterFee * (1 - slippage / 100);

  document.getElementById('amtOut').value =
    afterFee.toFixed(4);

  document.getElementById('rateDisp').textContent =
    `1 ${fromToken.symbol} = ${rate} ${toToken.symbol}`;

  document.getElementById('minRecv').textContent =
    `${minOut.toFixed(4)} ${toToken.symbol}`;

  updateSwapBtn();

}

// =====================================================
// UPDATE SWAP BUTTON
// =====================================================

function updateSwapBtn(){

  const btn =
    document.getElementById('swapBtn');

  if(!btn) return;

  const amount =
    parseFloat(
      document.getElementById('amtIn').value || 0
    );

  if(!account){

    btn.innerText =
      'Connect Wallet to Swap';

    return;
  }

  if(amount <= 0){

    btn.innerText =
      'Enter Amount';

    return;
  }

  const out =
    document.getElementById('amtOut').value || '0';

  btn.innerText =
    `Swap ${amount} ${fromToken.symbol} → ${out} ${toToken.symbol}`;

}

// =====================================================
// SWAP BUTTON
// =====================================================

async function executeSwap(setTimeout(()=>{

  alert("Swap completed successfully!");

  btn.innerText = 'Swap Success ✓';

  btn.disabled = false;

  updateSwapBtn();

}, 1800);){

  if(!account){

    connectWallet();

    return;
  }

  const amount =
    parseFloat(
      document.getElementById('amtIn').value || 0
    );

  if(amount <= 0){

    alert('Enter amount');

    return;
  }

  const btn =
    document.getElementById('swapBtn');

  btn.innerText = 'Swapping...';

  btn.disabled = true;

  setTimeout(()=>{

    btn.innerText = 'Swap Success ✓';

    btn.disabled = false;

    alert('Swap completed!');

    updateSwapBtn();

  }, 1800);

}

// =====================================================
// SLIPPAGE
// =====================================================

function setSlippage(value, btn){

  slippage = value;

  document.querySelectorAll('.slip-btn')
  .forEach(b=>{
    b.classList.remove('active');
  });

  btn.classList.add('active');

  calcOutput();

}

// =====================================================
// FLIP TOKENS
// =====================================================

function flipTokens(){

  [fromToken, toToken] =
    [toToken, fromToken];

  // FROM
  document.getElementById('symFrom')
  .textContent = fromToken.symbol;

  document.getElementById('iconFrom')
  .textContent = fromToken.label;

  document.getElementById('iconFrom')
  .style.background = fromToken.color;

  document.getElementById('balFrom')
  .textContent = fromToken.balance;

  // TO
  document.getElementById('symTo')
  .textContent = toToken.symbol;

  document.getElementById('iconTo')
  .textContent = toToken.label;

  document.getElementById('iconTo')
  .style.background = toToken.color;

  document.getElementById('balTo')
  .textContent = toToken.balance;

  calcOutput();

}

// =====================================================
// TOKEN MODAL
// =====================================================

let modalTarget = null;

function openModal(target){

  modalTarget = target;

  document.getElementById('tokenModal')
  .classList.add('open');

}

function closeModal(event){

  if(
    !event ||
    event.target.id === 'tokenModal'
  ){

    document.getElementById('tokenModal')
    .classList.remove('open');

  }

}

function selectToken(index){

  const token = TOKENS[index];

  if(modalTarget === 'from'){

    fromToken = token;

    document.getElementById('symFrom')
    .textContent = token.symbol;

    document.getElementById('iconFrom')
    .textContent = token.label;

    document.getElementById('iconFrom')
    .style.background = token.color;

    document.getElementById('balFrom')
    .textContent = token.balance;

  }else{

    toToken = token;

    document.getElementById('symTo')
    .textContent = token.symbol;

    document.getElementById('iconTo')
    .textContent = token.label;

    document.getElementById('iconTo')
    .style.background = token.color;

    document.getElementById('balTo')
    .textContent = token.balance;

  }

  closeModal();

  calcOutput();

}

// =====================================================
// FAUCET
// =====================================================

function openFaucet(){

  window.open(
    'https://faucet.circle.com/',
    '_blank'
  );

}

// =====================================================
// DOCS
// =====================================================

function openDocs(){

  window.open(
    'https://docs.arc.io/',
    '_blank'
  );

}

// =====================================================
// EXPLORER
// =====================================================

function openExplorer(){

  window.open(
    'https://testnet.arcscan.app/',
    '_blank'
  );

}

// =====================================================
// GITHUB
// =====================================================

function openGithub(){

  window.open(
    'https://github.com/Alexxxxxxxxxxxx12',
    '_blank'
  );

}

// =====================================================
// INIT
// =====================================================

document.addEventListener('DOMContentLoaded', ()=>{

  // show swap page first
  switchPage('swap');

  // button
  updateSwapBtn();

  // amount input
  const amtIn =
    document.getElementById('amtIn');

  if(amtIn){

    amtIn.addEventListener('input', calcOutput);

  }

  // connect button
  const connectBtn =
    document.querySelector('.btn-connect');

  if(connectBtn){

    connectBtn.addEventListener(
      'click',
      connectWallet
    );

  }

  // swap button
  const swapBtn =
    document.getElementById('swapBtn');

  if(swapBtn){

    swapBtn.addEventListener(
      'click',
      executeSwap
    );

  }

  // hide all pages except swap
  document.querySelectorAll('.page')
  .forEach(page=>{

    page.style.display = 'none';

  });

  const swapPage =
    document.getElementById('page-swap');

  if(swapPage){

    swapPage.style.display = 'block';

  }

}


async function claimGM() {

  const btn = document.getElementById('gmBtn');

  if(!window.ethereum){
    alert("Install MetaMask");
    return;
  }

  try {

    btn.innerText = "Waiting for wallet...";
    btn.disabled = true;

    await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const tx = await signer.sendTransaction({
      to: await signer.getAddress(),
      value: ethers.utils.parseEther("0")
    });

    btn.innerText = "Confirm in MetaMask...";

    await tx.wait();

    btn.innerText = "✓ GM Claimed! +50 XP";

    alert("GM claimed successfully!");

  } catch(err){

    console.log(err);

    btn.innerText = "Say GM & Claim XP";
    btn.disabled = false;

    alert("Transaction cancelled");

  }

}


