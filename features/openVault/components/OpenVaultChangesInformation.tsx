import { Flex, Text } from '@theme-ui/components'
import BigNumber from 'bignumber.js'
import {
  VaultChangesInformationArrow,
  VaultChangesInformationContainer,
  VaultChangesInformationEstimatedGasFee,
  VaultChangesInformationItem,
} from 'components/vault/VaultChangesInformation'
import { getCollRatioColor } from 'components/vault/VaultDetails'
import { formatCryptoBalance, formatPercent } from 'helpers/formatters/format'
import { pick } from 'helpers/pick'
import { useSelectFromContext } from 'helpers/useSelectFromContext'
import { zero } from 'helpers/zero'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { OpenBorrowVaultContext } from './OpenVaultView'

export function OpenVaultChangesInformation() {
  const { t } = useTranslation()
  const {
    token,
    afterCollateralizationRatio,
    afterLiquidationPrice,
    afterFreeCollateral,
    generateAmount,
    maxGenerateAmountCurrentPrice,
    inputAmountsEmpty,
    depositAmount,
    liquidationRatio,
    collateralizationDangerThreshold,
    collateralizationWarningThreshold,
    gasEstimationStatus,
    gasEstimationUsd,
  } = useSelectFromContext(OpenBorrowVaultContext, (ctx) => ({
    ...pick(
      ctx,
      'token',
      'afterCollateralizationRatio',
      'afterLiquidationPrice',
      'afterFreeCollateral',
      'generateAmount',
      'maxGenerateAmountCurrentPrice',
      'inputAmountsEmpty',
      'depositAmount',
      'gasEstimationStatus',
      'gasEstimationUsd',
    ),
    ...pick(
      ctx.ilkData,
      'liquidationRatio',
      'collateralizationDangerThreshold',
      'collateralizationWarningThreshold',
    ),
  }))
  const collRatioColor = getCollRatioColor(
    inputAmountsEmpty,
    liquidationRatio,
    collateralizationDangerThreshold,
    collateralizationWarningThreshold,
    afterCollateralizationRatio,
  )

  // starting zero balance for UI to show arrows
  const zeroBalance = formatCryptoBalance(zero)

  return !inputAmountsEmpty ? (
    <VaultChangesInformationContainer title="Vault changes">
      <VaultChangesInformationItem
        label={`${t('system.collateral-locked')}`}
        value={
          <Flex>
            {zeroBalance} {token}
            <VaultChangesInformationArrow />
            {formatCryptoBalance(depositAmount || zero)} {token}
          </Flex>
        }
      />
      <VaultChangesInformationItem
        label={`${t('system.collateralization-ratio')}`}
        value={
          <Flex>
            {formatPercent(zero.times(100), {
              precision: 2,
              roundMode: BigNumber.ROUND_DOWN,
            })}
            <VaultChangesInformationArrow />
            <Text sx={{ color: collRatioColor }}>
              {formatPercent(afterCollateralizationRatio.times(100), {
                precision: 2,
                roundMode: BigNumber.ROUND_DOWN,
              })}
            </Text>
          </Flex>
        }
      />
      <VaultChangesInformationItem
        label={`${t('system.liquidation-price')}`}
        value={
          <Flex>
            {`$${zeroBalance}`}
            <VaultChangesInformationArrow />
            {`$${formatCryptoBalance(afterLiquidationPrice || zero)}`}
          </Flex>
        }
      />
      <VaultChangesInformationItem
        label={`${t('system.vault-dai-debt')}`}
        value={
          <Flex>
            {zeroBalance} DAI
            <VaultChangesInformationArrow />
            {formatCryptoBalance(generateAmount || zero)} DAI
          </Flex>
        }
      />
      <VaultChangesInformationItem
        label={`${t('system.available-to-withdraw')}`}
        value={
          <Flex>
            {zeroBalance} {token}
            <VaultChangesInformationArrow />
            {formatCryptoBalance(afterFreeCollateral || zero)} {token}
          </Flex>
        }
      />
      <VaultChangesInformationItem
        label={`${t('system.available-to-generate')}`}
        value={
          <Flex>
            {zeroBalance} DAI
            <VaultChangesInformationArrow />
            {formatCryptoBalance(maxGenerateAmountCurrentPrice.minus(generateAmount || zero))} DAI
          </Flex>
        }
      />
      <VaultChangesInformationEstimatedGasFee
        gasEstimationStatus={gasEstimationStatus}
        gasEstimationUsd={gasEstimationUsd}
      />
    </VaultChangesInformationContainer>
  ) : null
}
