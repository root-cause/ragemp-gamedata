const Natives = {
    // FILES
    GET_TATTOO_SHOP_DLC_ITEM_DATA: 0xFF56381874F82086n,
    GET_SHOP_PED_COMPONENT: 0x74C0E2A57EC66760n,
    GET_SHOP_PED_PROP: 0x5D5CAFF661DDF6FCn,
    GET_DLC_WEAPON_DATA: 0x79923CD21BECE14En,
    GET_DLC_WEAPON_COMPONENT_DATA: 0x6CF598A2957C2BF8n,
    GET_DLC_VEHICLE_DATA: 0x33468EDC08E371F6n,
    GET_SHOP_PED_OUTFIT: 0xB7952076E444979Dn,
    GET_SHOP_PED_OUTFIT_COMPONENT_VARIANT: 0x19F2A026EDF0013Fn,
    GET_SHOP_PED_OUTFIT_PROP_VARIANT: 0xA9F9C2E0FDE11CBBn,

    // PED
    GET_PED_HEAD_BLEND_DATA: 0x2746BD9D88C5C5D0n,

    // WEAPON
    GET_WEAPON_HUD_STATS: 0xD92C739EE34C9EBAn,
    GET_WEAPON_COMPONENT_HUD_STATS: 0xB3CAF387AE12E9F8n
};

function readTextLabel(dataView, offset) {
    let output = "";

    // using byteLength because textLabel is usually at the end anyway + it's a null terminated string
    while (offset < dataView.byteLength) {
        const char = dataView.getUint8(offset++, true);
        if (char === 0) {
            break;
        }

        output += String.fromCharCode(char);
    }

    return output;
}

// Credits to TomGrobbe (https://github.com/TomGrobbe)
function getTattooShopDlcItemData(characterType, decorationIndex) {
    let buffer = [ new ArrayBuffer(120) ];
    if (!mp.game.invoke(Natives.GET_TATTOO_SHOP_DLC_ITEM_DATA, characterType, decorationIndex, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        lockHash: view.getInt32(0, true),
        id: view.getInt32(8, true),
        collection: view.getInt32(16, true),
        preset: view.getInt32(24, true),
        cost: view.getInt32(32, true),
        eFacing: view.getInt32(40, true),
        updateGroup: view.getInt32(48, true),
        textLabel: readTextLabel(view, 56)
    };
}

function getShopPedComponent(componentHash) {
    let buffer = [ new ArrayBuffer(136) ];
    if (!mp.game.invoke(Natives.GET_SHOP_PED_COMPONENT, componentHash >> 0, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        lockHash: view.getInt32(0, true),
        uniqueNameHash: view.getInt32(8, true),
        locate: view.getInt32(16, true),
        drawableIndex: view.getInt32(24, true),
        textureIndex: view.getInt32(32, true),
        cost: view.getInt32(40, true),
        eCompType: view.getInt32(48, true),
        eShopEnum: view.getInt32(56, true),
        eCharacter: view.getInt32(64, true),
        textLabel: readTextLabel(view, 72)
    };
}

function getShopPedProp(propHash) {
    let buffer = [ new ArrayBuffer(136) ];
    if (!mp.game.invoke(Natives.GET_SHOP_PED_PROP, propHash >> 0, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        lockHash: view.getInt32(0, true),
        uniqueNameHash: view.getInt32(8, true),
        locate: view.getInt32(16, true),
        propIndex: view.getInt32(24, true),
        textureIndex: view.getInt32(32, true),
        cost: view.getInt32(40, true),
        eAnchorPoint: view.getInt32(48, true),
        eShopEnum: view.getInt32(56, true),
        eCharacter: view.getInt32(64, true),
        textLabel: readTextLabel(view, 72)
    };
}

function getPedHeadBlendData(entityOrHandle) {
    let buffer = [ new ArrayBuffer(80) ];
    if (!mp.game.invoke(Natives.GET_PED_HEAD_BLEND_DATA, entityOrHandle.handle !== undefined ? entityOrHandle.handle : entityOrHandle, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        shapeFirstId: view.getInt32(0, true),
        shapeSecondId: view.getInt32(8, true),
        shapeThirdId: view.getInt32(16, true),
        skinFirstId: view.getInt32(24, true),
        skinSecondId: view.getInt32(32, true),
        skinThirdId: view.getInt32(40, true),
        shapeMix: view.getFloat32(48, true),
        skinMix: view.getFloat32(56, true),
        thirdMix: view.getFloat32(64, true),
        isParent: Boolean(view.getInt32(72, true))
    };
}

function getWeaponHudStats(weaponHash) {
    let buffer = [ new ArrayBuffer(40) ];
    if (!mp.game.invoke(Natives.GET_WEAPON_HUD_STATS, weaponHash >> 0, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        hudDamage: view.getInt32(0, true),
        hudSpeed: view.getInt32(8, true),
        hudCapacity: view.getInt32(16, true),
        hudAccuracy: view.getInt32(24, true),
        hudRange: view.getInt32(32, true)
    };
}

function getWeaponComponentHudStats(componentHash) {
    let buffer = [ new ArrayBuffer(40) ];
    if (!mp.game.invoke(Natives.GET_WEAPON_COMPONENT_HUD_STATS, componentHash >> 0, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        hudDamage: view.getInt32(0, true),
        hudSpeed: view.getInt32(8, true),
        hudCapacity: view.getInt32(16, true),
        hudAccuracy: view.getInt32(24, true),
        hudRange: view.getInt32(32, true)
    };
}

function getDlcWeaponData(dlcWeaponIndex) {
    let buffer = [ new ArrayBuffer(312) ];
    if (!mp.game.invoke(Natives.GET_DLC_WEAPON_DATA, dlcWeaponIndex, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        lockHash: view.getInt32(0, true),
        weaponHash: view.getInt32(8, true),
        id: view.getInt32(16, true),
        cost: view.getInt32(24, true),
        ammoCost: view.getInt32(32, true),
        ammoType: view.getInt32(40, true),
        defaultClipSize: view.getInt32(48, true),
        textLabel: readTextLabel(view, 56),
        weaponDesc: readTextLabel(view, 120),
        weaponTT: readTextLabel(view, 184),
        weaponUppercase: readTextLabel(view, 248)
    };
}

function getDlcWeaponComponentData(dlcWeaponIndex, dlcWeaponComponentIndex) {
    let buffer = [ new ArrayBuffer(176) ];
    if (!mp.game.invoke(Natives.GET_DLC_WEAPON_COMPONENT_DATA, dlcWeaponIndex, dlcWeaponComponentIndex, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        attachBone: view.getInt32(0, true),
        isDefault: Boolean(view.getInt32(8, true)),
        lockHash: view.getInt32(16, true),
        componentHash: view.getInt32(24, true),
        id: view.getInt32(32, true),
        cost: view.getInt32(40, true),
        textLabel: readTextLabel(view, 48),
        componentDesc: readTextLabel(view, 112)
    };
}

function getDlcVehicleData(dlcVehicleIndex) {
    let buffer = [ new ArrayBuffer(24) ];
    if (!mp.game.invoke(Natives.GET_DLC_VEHICLE_DATA, dlcVehicleIndex, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        lockHash: view.getInt32(0, true),
        modelHash: view.getInt32(8, true),
        cost: view.getInt32(16, true)
    };
}

function getShopPedOutfit(outfitHash) {
    let buffer = [ new ArrayBuffer(120) ];
    if (!mp.game.invoke(Natives.GET_SHOP_PED_OUTFIT, outfitHash >> 0, buffer)) {
        return null;
    }

    const view = new DataView(buffer[0]);
    return {
        lockHash: view.getInt32(0, true),
        uniqueNameHash: view.getInt32(8, true),
        cost: view.getInt32(16, true),
        numProps: view.getInt32(24, true),
        numComponents: view.getInt32(32, true),
        eShopEnum: view.getInt32(40, true),
        eCharacter: view.getInt32(48, true),
        textLabel: readTextLabel(view, 56)
    };
}

function getShopPedOutfitComponentVariant(outfitHash, componentIndex) {
    let buffer = [ new ArrayBuffer(24) ];
    if (!mp.game.invoke(Natives.GET_SHOP_PED_OUTFIT_COMPONENT_VARIANT, outfitHash >> 0, componentIndex, buffer)) {
        return;
    }

    const view = new DataView(buffer[0]);
    return {
        uniqueNameHash: view.getInt32(0, true),
        enumValue: view.getInt32(8, true),
        eCompType: view.getInt32(16, true)
    };
}

function getShopPedOutfitPropVariant(outfitHash, propIndex) {
    let buffer = [ new ArrayBuffer(24) ];
    if (!mp.game.invoke(Natives.GET_SHOP_PED_OUTFIT_PROP_VARIANT, outfitHash >> 0, propIndex, buffer)) {
        return;
    }

    const view = new DataView(buffer[0]);
    return {
        uniqueNameHash: view.getInt32(0, true),
        enumValue: view.getInt32(8, true),
        eAnchorPoint: view.getInt32(16, true)
    };
}

// Define mp.game.data
mp.game.data = {
    getTattooShopDlcItemData,
    getShopPedComponent,
    getShopPedProp,
    getPedHeadBlendData,
    getWeaponHudStats,
    getWeaponComponentHudStats,
    getDlcWeaponData,
    getDlcWeaponComponentData,
    getDlcVehicleData,
    getShopPedOutfit,
    getShopPedOutfitComponentVariant,
    getShopPedOutfitPropVariant
};
