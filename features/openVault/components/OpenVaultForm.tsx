import { ALLOWED_MULTIPLY_TOKENS } from 'blockchain/tokensMetadata'
import { VaultChangesWithADelayCard } from 'components/vault/VaultChangesWithADelayCard'
import { VaultFormVaultTypeSwitch } from 'components/vault/VaultForm'
import { VaultFormContainer } from 'components/vault/VaultFormContainer'
import { pick } from 'helpers/pick'
import { useSelectFromContext } from 'helpers/useSelectFromContext'
import React from 'react'

import { Allowance } from './form/Allowance'
import { AllowanceStatus } from './form/AllowanceStatus'
import { OpenVaultErrors } from './form/OpenVaultErrors'
import { OpenVaultTitle } from './form/OpenVaultTitle'
import { OpenVaultWarnings } from './form/OpenVaultWarnings'
import { StatusCard } from './form/Status'
import { OpenVaultButton } from './OpenVaultButton'
import { OpenVaultConfirmation, OpenVaultStatus } from './OpenVaultConfirmation'
import { OpenVaultEditing } from './OpenVaultEditing'
import { OpenBorrowVaultContext } from './OpenVaultView'

export function OpenVaultForm() {
  const {
    isEditingStage,
    isProxyStage,
    isAllowanceStage,
    isOpenStage,
    ilk,
    stage,
    token,
  } = useSelectFromContext(OpenBorrowVaultContext, (ctx) => ({
    ...pick(
      ctx,
      'isEditingStage',
      'isProxyStage',
      'isAllowanceStage',
      'isOpenStage',
      'ilk',
      'stage',
      'token',
    ),
  }))

  return (
    <VaultFormContainer toggleTitle="Open Vault">
      <OpenVaultTitle />
      {isEditingStage && <OpenVaultEditing />}
      {isAllowanceStage && <Allowance />}
      {isOpenStage && <OpenVaultConfirmation />}
      <OpenVaultErrors />
      <OpenVaultWarnings />
      {stage === 'txSuccess' && <VaultChangesWithADelayCard />}
      <OpenVaultButton />
      {isProxyStage && <StatusCard />}
      {isAllowanceStage && <AllowanceStatus />}
      {isOpenStage && <OpenVaultStatus />}
      {isEditingStage ? (
        <VaultFormVaultTypeSwitch
          href={`/vaults/open-multiply/${ilk}`}
          title="Switch to Multiply"
          visible={ALLOWED_MULTIPLY_TOKENS.includes(token)}
        />
      ) : null}
    </VaultFormContainer>
  )
}
