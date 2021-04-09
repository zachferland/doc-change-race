import { publishIDXConfig } from '@ceramicstudio/idx-tools'
import { schemas, definitions } from '@ceramicstudio/idx-constants'
import CeramicClient from '@ceramicnetwork/http-client'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { randomBytes } from '@stablelib/random'

// run with no data 
//  rm -rf ./test/data && ceramic daemon --state-store-directory ./test/data --network inmemory

const ceramic = new CeramicClient.default()
await publishIDXConfig(ceramic)

const provider = new Ed25519Provider(randomBytes(32))
await ceramic.setDIDProvider(provider)

const keychain = await ceramic.createDocument(
    'tile',
    { deterministic: true, metadata: { controllers: [ceramic.did.id], family: definitions.threeIdKeychain } },
    { anchor: false, publish: false }
)

//update one
const update1 = {
    metadata: { 
        schema: schemas.ThreeIdKeychain 
    },
    content: {
        authMap: {
            'did:key:z6Mks9BtZq855KXUEGEvNpHiKm9gY7BmrXTH7p8t1JeULjmR': {
                id: {},
                data: {}
            }
        },
        pastSeeds: []
    }
}

await keychain.change(update1)
console.log(keychain.content)

//update one
const update2 = {
    content: {
        authMap: {
            'did:key:z6Mks9BtZq855KXUEGEvNpHiKm9gY7BmrXTH7p8t1JeULjmR': {
                id: {},
                data: {}
            },
            'did:key:z6MkoVfbapHsHVG9tftPhCLP1p5AafQ3knVusPWH2BFgH2F2': {
                id: {},
                data: {}
            }
        },
        pastSeeds: []
    }
}

await keychain.change(update2)
console.log(keychain.content)

await ceramic.close()
console.log('done')