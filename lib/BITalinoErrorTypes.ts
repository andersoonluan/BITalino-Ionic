
export enum BITalinoErrorTypes {
    BT_DEVICE_NOT_CONNECTED = "Bluetooth Device not connected",
    PORT_COULD_NOT_BE_OPENED = "The communication port could not be initialized. The provided parameters could not be set.",
    DEVICE_NOT_IDLE = "Device not in idle mode",
    DEVICE_NOT_IN_ACQUISITION_MODE = "Device not is acquisition mode",
    UNDEFINED_SAMPLING_RATE_NOT = "The Sampling Rate chose cannot be set in BITalino. Choose 1000,100,10 or 1",
    LOST_COMMUNICATION = "The Computer lost communication",
    INVALID_PARAMETER = "Invalid parameter",
    INVALID_THRESHOLD = "The threshold value must be between 0 and 63",
    INVALID_ANALOG_CHANNELS = "The number of analog channels available are between 0 and 5",
    DECODE_INVALID_DATA = "Incorrect data to be decoded",
    INVALID_DIGITAL_CHANNELS = "To set the digital outputs, the input array must have 4 items, one for each channel.",
    INVALID_MAC_ADDRESS = "MAC address not valid.",
    UNDEFINED = "UNDEFINED ERROR",
    FAILED = "Failed to communication with your BITalino."
}
