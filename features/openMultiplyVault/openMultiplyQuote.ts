import BigNumber from 'bignumber.js'
import { every5Seconds$ } from 'blockchain/network'
import { ExchangeAction, Quote } from 'features/exchange/exchange'
import { compareBigNumber } from 'helpers/compareBigNumber'
import { SLIPPAGE } from 'helpers/multiply/calculations'
import { EMPTY, Observable, combineLatest } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators'

import { OpenMultiplyVaultChange, OpenMultiplyVaultState } from './openMultiplyVault'

type ExchangeQuoteSuccessChange = {
  kind: 'quote'
  quote: Quote
}

type ExchangeQuoteFailureChange = {
  kind: 'quoteError'
}

type ExchangeSwapSuccessChange = {
  kind: 'swap'
  swap: Quote
}

type ExchangeSwapFailureChange = {
  kind: 'swapError'
}

type ExchangeQuoteResetChange = {
  kind: 'quoteReset'
}
export type ExchangeQuoteChanges =
  | ExchangeQuoteSuccessChange
  | ExchangeQuoteFailureChange
  | ExchangeQuoteResetChange
  | ExchangeSwapSuccessChange
  | ExchangeSwapFailureChange

export function applyExchange(change: OpenMultiplyVaultChange, state: OpenMultiplyVaultState) {
  if (change.kind === 'quoteError' || change.kind === 'swapError') {
    return {
      ...state,
      exchangeError: true,
    }
  }

  if (change.kind === 'quote') {
    return {
      ...state,
      quote: change.quote,
      exchangeError: false,
    }
  }

  if (change.kind === 'swap') {
    return {
      ...state,
      swap: change.swap,
      exchangeError: false,
    }
  }

  if (change.kind === 'quoteReset') {
    const { quote: _quote, ...rest } = state
    return rest
  }

  return state
}

export function quoteToChange(quote: Quote) {
  return quote.status === 'SUCCESS'
    ? { kind: 'quote' as const, quote }
    : { kind: 'quoteError' as const }
}

export function swapToChange(swap: Quote) {
  return swap.status === 'SUCCESS'
    ? { kind: 'swap' as const, swap }
    : { kind: 'swapError' as const }
}

export function createExchangeChange$(
  exchangeQuote$: (
    token: string,
    slippage: BigNumber,
    amount: BigNumber,
    action: ExchangeAction,
  ) => Observable<Quote>,
  state$: Observable<OpenMultiplyVaultState>,
) {
  return state$.pipe(
    filter((state) => state.depositAmount !== undefined),
    distinctUntilChanged(
      (s1, s2) =>
        compareBigNumber(s1.depositAmount, s2.depositAmount) &&
        compareBigNumber(s1.requiredCollRatio, s2.requiredCollRatio),
    ),
    debounceTime(500),
    switchMap(
      // () =>
      //   every5Seconds$.pipe(
      //     switchMap(() => {
      //       console.log('every 5 secs')

      //       return state$.pipe(
      //         switchMap((state) => {
      //           if (state.buyingCollateral.gt(0) && state.quote?.status === 'SUCCESS') {
      //             console.log(`
      //               before 1inch

      //               afterOuts: ${state.afterOutstandingDebt.toFixed()}
      //               afterOutsMinusFee: ${state.afterOutstandingDebt
      //                 .times(one.minus(OAZO_FEE))
      //                 .toFixed()}
      //             `)

      //             return exchangeQuote$(
      //               state.token,
      //               state.slippage,
      //               state.afterOutstandingDebt.times(one.minus(OAZO_FEE)),
      //               'BUY_COLLATERAL',
      //             )
      //           }
      //           return EMPTY
      //         }),
      //       )
      //     }),
      //   ),
      // TO DO for every 5 secs we use old value of afterOutstandingDebt, after fetch we update market price
      // which is factor for calculatinf afterOutstandingDebt
      (state) =>
        every5Seconds$.pipe(
          switchMap(() => {
            if (state.buyingCollateral.gt(0) && state.quote?.status === 'SUCCESS') {
              return exchangeQuote$(
                state.token,
                state.slippage,
                state.oneInchAmount,
                'BUY_COLLATERAL',
              )
            }
            return EMPTY
          }),
        ),
    ),
    map(swapToChange),
  )
}

export function createInitialQuoteChange(
  exchangeQuote$: (
    token: string,
    slippage: BigNumber,
    amount: BigNumber,
    action: ExchangeAction,
  ) => Observable<Quote>,
  token: string,
) {
  return exchangeQuote$(token, SLIPPAGE, new BigNumber(1), 'BUY_COLLATERAL').pipe(
    map(quoteToChange),
    take(1),
  )
}
