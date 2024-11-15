async function requestUSBDevice() {
    try {
        // Modify the filter to match the specific vendorId and productId for the CID card device
        const device = await navigator.usb.requestDevice({
            filters: [
                { vendorId: 0x058F, productId: 0x9540 }  // Replace with actual vendorId and productId
            ]
        });

        return {
            deviceName: device.productName,
            deviceManufacturer: device.manufacturerName,
            deviceVendorId: device.vendorId,
            deviceProductId: device.productId
        };
    } catch (err) {
        console.error("Failed to request USB device", err);
        return null;
    }
}

