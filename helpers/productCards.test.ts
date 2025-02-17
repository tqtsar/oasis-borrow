import { BigNumber } from 'bignumber.js'
import { expect } from 'chai'
import { mockIlkData } from 'helpers/mocks/ilks.mock'
import { getStateUnpacker } from 'helpers/testHelpers'
import { of } from 'rxjs'

import { mockPriceInfo$ } from './mocks/priceInfo.mock'
import {
  borrowPageCardsData,
  createProductCardsData$,
  landingPageCardsData,
  multiplyPageCardsData,
} from './productCards'

const wbtcA = mockIlkData({
  token: 'WTBC',
  ilk: 'WBTC-A',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const wbtcB = mockIlkData({
  token: 'WBTC',
  ilk: 'WBTC-B',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const wbtcC = mockIlkData({
  token: 'WBTC',
  ilk: 'WBTC-C',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const renbtc = mockIlkData({
  token: 'RENBTC',
  ilk: 'RENBTC-A',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const ethA = mockIlkData({
  token: 'ETH',
  ilk: 'ETH-A',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const ethB = mockIlkData({
  token: 'ETH',
  ilk: 'ETH-B',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const ethC = mockIlkData({
  token: 'ETH',
  ilk: 'ETH-C',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const linkA = mockIlkData({
  token: 'LINK',
  ilk: 'LINK-A',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const wsteth = mockIlkData({
  token: 'WSTETH',
  ilk: 'WSTETH-A',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const guni = mockIlkData({
  token: 'GUNIV3DAIUSDC2',
  ilk: 'GUNIV3DAIUSDC2-A',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

const crv = mockIlkData({
  token: 'CRVV1ETHSTETH',
  ilk: 'CRVV1ETHSTETH-A',
  stabilityFee: new BigNumber('0.045'),
  liquidationRatio: new BigNumber('1.4'),
})()

describe('createProductCardsData$', () => {
  it('should return correct product data', () => {
    const state = getStateUnpacker(createProductCardsData$(of([wbtcA]), () => mockPriceInfo$()))

    expect(state()[0]).to.eql({
      background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
      bannerIcon: '/static/img/tokens/wbtc.png',
      bannerGif: '/static/img/tokens/wbtc.gif',
      currentCollateralPrice: new BigNumber(550),
      ilk: 'WBTC-A',
      liquidationRatio: new BigNumber(1.4),
      name: 'Wrapped Bitcoin',
      stabilityFee: new BigNumber(0.045),
      token: 'WBTC',
      isFull: false,
    })
  })

  it('should return correct landing page product data', () => {
    const state = getStateUnpacker(
      createProductCardsData$(of([wbtcB, ethB, guni, wsteth]), () => mockPriceInfo$()),
    )

    const landingPageData = landingPageCardsData({ productCardsData: state() })

    expect(landingPageData).to.eql([
      {
        token: wbtcB.token,
        ilk: wbtcB.ilk,
        liquidationRatio: wbtcB.liquidationRatio,
        stabilityFee: wbtcB.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/wbtc.png',
        bannerGif: '/static/img/tokens/wbtc.gif',
        background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
        name: 'Wrapped Bitcoin',
        isFull: false,
      },
      {
        token: ethB.token,
        ilk: ethB.ilk,
        liquidationRatio: ethB.liquidationRatio,
        stabilityFee: ethB.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/eth.png',
        bannerGif: '/static/img/tokens/eth.gif',
        background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
        name: 'Ether',
        isFull: false,
      },
      {
        token: guni.token,
        ilk: guni.ilk,
        liquidationRatio: guni.liquidationRatio,
        stabilityFee: guni.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/uni_old_dai_usdc.png',
        bannerGif: '/static/img/tokens/uni_old_dai_usdc.gif',
        background: 'linear-gradient(171.29deg, #FDDEF0 -2.46%, #FFF0F9 -2.45%, #FFF6F1 99.08%)',
        name: 'GUNIV3 DAI/USDC 0.01%',
        isFull: false,
      },
    ])
  })

  it('should return correct multiple page product data', () => {
    const state = getStateUnpacker(
      createProductCardsData$(of([wbtcB, ethB, guni, wsteth]), () => mockPriceInfo$()),
    )

    const multiplyPageData = multiplyPageCardsData({
      productCardsData: state(),
      cardsFilter: 'Featured',
    })

    expect(multiplyPageData).to.eql([
      {
        token: wbtcB.token,
        ilk: wbtcB.ilk,
        liquidationRatio: wbtcB.liquidationRatio,
        stabilityFee: wbtcB.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/wbtc.png',
        bannerGif: '/static/img/tokens/wbtc.gif',
        background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
        name: 'Wrapped Bitcoin',
        isFull: false,
      },
      {
        token: ethB.token,
        ilk: ethB.ilk,
        liquidationRatio: ethB.liquidationRatio,
        stabilityFee: ethB.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/eth.png',
        bannerGif: '/static/img/tokens/eth.gif',
        background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
        name: 'Ether',
        isFull: false,
      },
      {
        token: guni.token,
        ilk: guni.ilk,
        liquidationRatio: guni.liquidationRatio,
        stabilityFee: guni.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/uni_old_dai_usdc.png',
        bannerGif: '/static/img/tokens/uni_old_dai_usdc.gif',
        background: 'linear-gradient(171.29deg, #FDDEF0 -2.46%, #FFF0F9 -2.45%, #FFF6F1 99.08%)',
        name: 'GUNIV3 DAI/USDC 0.01%',
        isFull: false,
      },
    ])
  })

  it('should return correct multiple page token product data', () => {
    const state = getStateUnpacker(
      createProductCardsData$(of([wbtcA, ethA, linkA, wsteth]), () => mockPriceInfo$()),
    )

    const multiplyPageData = multiplyPageCardsData({
      productCardsData: state(),
      cardsFilter: 'ETH',
    })

    expect(multiplyPageData).to.eql([
      {
        token: ethA.token,
        ilk: ethA.ilk,
        liquidationRatio: ethA.liquidationRatio,
        stabilityFee: ethA.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/eth.png',
        bannerGif: '/static/img/tokens/eth.gif',
        background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
        name: 'Ether',
        isFull: false,
      },
      {
        token: wsteth.token,
        ilk: wsteth.ilk,
        liquidationRatio: wsteth.liquidationRatio,
        stabilityFee: wsteth.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/wstETH.png',
        bannerGif: '/static/img/tokens/wstETH.gif',
        background: 'linear-gradient(158.87deg, #E2F7F9 0%, #D3F3F5 100%), #FFFFFF',
        name: 'WSTETH',
        isFull: false,
      },
    ])
  })

  it('should return correct borrow page product data', () => {
    const state = getStateUnpacker(
      createProductCardsData$(of([wbtcC, ethA, ethC, linkA, wsteth, crv]), () => mockPriceInfo$()),
    )

    const borrowPageData = borrowPageCardsData({
      productCardsData: state(),
      cardsFilter: 'Featured',
    })

    expect(borrowPageData).to.eql([
      {
        token: wbtcC.token,
        ilk: wbtcC.ilk,
        liquidationRatio: wbtcC.liquidationRatio,
        stabilityFee: wbtcC.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/wbtc.png',
        bannerGif: '/static/img/tokens/wbtc.gif',
        background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
        name: 'Wrapped Bitcoin',
        isFull: false,
      },
      {
        token: ethC.token,
        ilk: ethC.ilk,
        liquidationRatio: ethC.liquidationRatio,
        stabilityFee: ethC.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/eth.png',
        bannerGif: '/static/img/tokens/eth.gif',
        background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
        name: 'Ether',
        isFull: false,
      },
      {
        // from here
        token: wsteth.token,
        ilk: wsteth.ilk,
        liquidationRatio: wsteth.liquidationRatio,
        stabilityFee: wsteth.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/wstETH.png',
        bannerGif: '/static/img/tokens/wstETH.gif',
        background: 'linear-gradient(158.87deg, #E2F7F9 0%, #D3F3F5 100%), #FFFFFF',
        name: 'WSTETH',
        isFull: false,
      }, // remove this when crv is added back to the borrow page
      // {
      //   token: crv.token,
      //   ilk: crv.ilk,
      //   liquidationRatio: crv.liquidationRatio,
      //   stabilityFee: crv.stabilityFee,
      //   currentCollateralPrice: new BigNumber('550'),
      //   bannerIcon: '/static/img/tokens/crv_steth_eth.png',
      //   bannerGif: '/static/img/tokens/crv_steth_eth.gif',
      //   background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
      //   name: 'stETH/ETH CRV',
      //   isFull: false,
      // }, temporary disabled
    ])
  })

  it('should return correct borrow page token product data', () => {
    const state = getStateUnpacker(
      createProductCardsData$(of([wbtcA, ethA, ethC, linkA, wsteth, renbtc]), () =>
        mockPriceInfo$(),
      ),
    )

    const borrowPageData = borrowPageCardsData({ productCardsData: state(), cardsFilter: 'BTC' })

    expect(borrowPageData).to.eql([
      {
        token: renbtc.token,
        ilk: renbtc.ilk,
        liquidationRatio: renbtc.liquidationRatio,
        stabilityFee: renbtc.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/renBTC.png',
        bannerGif: '/static/img/tokens/renBTC.gif',
        background: 'linear-gradient(160.47deg, #F1F5F5 0.35%, #E5E7E8 99.18%), #FFFFFF',
        name: 'renBTC',
        isFull: false,
      },
      {
        token: wbtcA.token,
        ilk: wbtcA.ilk,
        liquidationRatio: wbtcA.liquidationRatio,
        stabilityFee: wbtcA.stabilityFee,
        currentCollateralPrice: new BigNumber('550'),
        bannerIcon: '/static/img/tokens/wbtc.png',
        bannerGif: '/static/img/tokens/wbtc.gif',
        background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
        name: 'Wrapped Bitcoin',
        isFull: false,
      },
    ])
  })

  it('should custom sort the cards', () => {
    const state = getStateUnpacker(
      createProductCardsData$(
        of([wbtcA, ethA, ethC, linkA, wsteth, renbtc, ethB, wbtcB, wbtcC]),
        () => mockPriceInfo$(),
      ),
    )

    const borrowPageData = borrowPageCardsData({ productCardsData: state(), cardsFilter: 'ETH' })

    expect(borrowPageData[0].ilk).to.eql(ethC.ilk)
    expect(borrowPageData[1].ilk).to.eql(ethA.ilk)
    expect(borrowPageData[2].ilk).to.eql(wsteth.ilk)
    expect(borrowPageData[3].ilk).to.eql(ethB.ilk)

    const multiplyCardData = multiplyPageCardsData({
      productCardsData: state(),
      cardsFilter: 'BTC',
    })

    expect(multiplyCardData[0].ilk).to.eql(wbtcB.ilk)
    expect(multiplyCardData[1].ilk).to.eql(wbtcA.ilk)
    expect(multiplyCardData[2].ilk).to.eql(renbtc.ilk)
    expect(multiplyCardData[3].ilk).to.eql(wbtcC.ilk)
  })

  it('does not sort product cards that have no custom ordering')
})
