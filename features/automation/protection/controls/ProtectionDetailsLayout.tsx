import BigNumber from 'bignumber.js'
import { VaultDetailsCardCurrentPrice } from 'components/vault/detailsCards/VaultDetailsCardCurrentPrice'
import { VaultDetailsCardDynamicStopPrice } from 'components/vault/detailsCards/VaultDetailsCardDynamicStopPrice'
import { VaultDetailsCardMaxTokenOnStopLossTrigger } from 'components/vault/detailsCards/VaultDetailsCardMaxTokenOnStopLossTrigger'
import { VaultDetailsCardStopLossCollRatio } from 'components/vault/detailsCards/VaultDetailsCardStopLossCollRatio'
import React from 'react'
import { Box, Grid } from 'theme-ui'

import { calculatePricePercentageChange } from '../../../../blockchain/prices'
import { getAfterPillColors } from '../../../../components/vault/VaultDetails'

export interface ProtectionDetailsLayoutProps {
  slRatio: BigNumber
  vaultDebt: BigNumber
  currentOraclePrice: BigNumber
  nextOraclePrice: BigNumber
  isStaticPrice: boolean
  isStopLossEnabled: boolean
  lockedCollateral: BigNumber
  token: string
  liquidationRatio: BigNumber
  liquidationPenalty: BigNumber
  afterSlRatio: BigNumber
  isCollateralActive: boolean
  isEditing: boolean
}

export function ProtectionDetailsLayout({
  slRatio,
  vaultDebt,
  currentOraclePrice,
  nextOraclePrice,
  isStaticPrice,
  isStopLossEnabled,
  lockedCollateral,
  token,
  liquidationRatio,
  liquidationPenalty,
  afterSlRatio,
  isCollateralActive,
  isEditing,
}: ProtectionDetailsLayoutProps) {
  const afterPillColors = getAfterPillColors('onSuccess')

  const percentageChange = calculatePricePercentageChange(currentOraclePrice, nextOraclePrice)
  const collateralizationRatio = lockedCollateral.times(currentOraclePrice).div(vaultDebt)

  const liquidationPrice = vaultDebt.times(liquidationRatio).div(lockedCollateral)

  return (
    <Box>
      <Grid variant="vaultDetailsCardsContainer">
        <VaultDetailsCardStopLossCollRatio
          slRatio={slRatio}
          collateralizationRatio={collateralizationRatio}
          isProtected={isStopLossEnabled}
          showAfterPill={isEditing}
          afterSlRatio={afterSlRatio}
          afterPillColors={afterPillColors}
        />
        <VaultDetailsCardDynamicStopPrice
          slRatio={slRatio}
          liquidationPrice={liquidationPrice}
          liquidationRatio={liquidationRatio}
          isProtected={isStopLossEnabled}
          showAfterPill={isEditing}
          afterSlRatio={afterSlRatio}
          afterPillColors={afterPillColors}
        />
        <VaultDetailsCardCurrentPrice
          currentCollateralPrice={currentOraclePrice}
          nextCollateralPrice={nextOraclePrice}
          isStaticCollateralPrice={isStaticPrice}
          collateralPricePercentageChange={percentageChange}
        />

        <VaultDetailsCardMaxTokenOnStopLossTrigger
          slRatio={slRatio}
          isProtected={isStopLossEnabled}
          liquidationPrice={liquidationPrice}
          liquidationPenalty={liquidationPenalty}
          debt={vaultDebt}
          liquidationRatio={liquidationRatio}
          token={token}
          showAfterPill={isEditing}
          lockedCollateral={lockedCollateral}
          afterSlRatio={afterSlRatio}
          afterPillColors={afterPillColors}
          isCollateralActive={isCollateralActive}
          tokenPrice={currentOraclePrice}
        />
      </Grid>
    </Box>
  )
}
