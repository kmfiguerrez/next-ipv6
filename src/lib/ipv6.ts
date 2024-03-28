import { getErrorMessage } from "./error-message"

export type TIPv6ReturnData = {
  success: boolean
  data?: string | number | bigint | TPrefix
  error?: string
}

/**
 * This type is used in IPv6 static getPrefix method.
 * 
 * @property `errorFields` is the param list of getPrefix method.
 */
type TPrefixData = TIPv6ReturnData & {
  errorFields?: Array<TParamError>
}

/**
 * This type is used in IPv6 static getPrefix method.
 * 
 * @property `field` is a parameter name.
 */
type TParamError = {
  field: string
  message: string
}

type TBaseNumberSystem = 2 | 16

/**
 * @property `id` is string of binaries.
 * @property `firstUsableAddressBin` is string of binaries.
 * @property `lastUsableAddresssBin` is string of binaries.
 */
type TInterfaceID = {
  id: string
  bits: number
  firstUsableAddressBin: string
  lastUsableAddresssBin: string
}

/**
 * @property `id` is a string of hexadecimals.
 * @property `networkPortionBin` is a string of binaries.
 * @property `subnetPortionBin` is a string of binaries.
 */
type TPrefix = {
  id: string
  subnetNumber: bigint
  networkPortionBin: string
  subnetPortionBin: string
  interfaceIdPortion: TInterfaceID
  newPrefixLength: number
  firstUsableAddress: string
  lastUsableAddresss: string
}

/*
  In this class definitions. I decided to use hexadecimals and binaries 
  as type string because:
  - Hex includes letters.
  - The number Binary digits and its values large enough larger 
  - to be outside of JS max safe integers loses precision.
  - Data coming from user interfaces are of type string.
*/
class IPv6 {

  /**
   * This method is used to check format of user input IPv6 Address.
   * 
   * It performs a sequence of checkings where each checking must passed
   * to get to the next one, otherwise will return false.
   * 
   * @param {string} ipv6Address - A string of IPv6 address.
   * 
   * @returns {boolean} Boolean
   */
  static isValidIpv6(ipv6Address: string): boolean {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    // Regex pattern.
    // [0-9a-f]{1,4} means a segment of at least one and max at four of hex digits.
    // [0-9a-f]{1,4}: means a segment that ends with a semi-colon.
    // ([0-9a-f]{1,4}:){7} means a segment ends with a semi-colon, seven times.
    const completeIPv6AddPattern = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/
    let segments: RegExpMatchArray | null
    let regexPattern: RegExp
    const ipv6CharPattern = /[^a-f0-9:]/



    if (ipv6Address === undefined || ipv6Address === null || ipv6Address === "") {
      console.error("From isValidIPv6: Invalid IPv6 format - IPv6 Address cannot be undefined, null nor an empty string.")
      return false
    }

    // Check if user input uses valid ipv6 characters.
    if (ipv6CharPattern.test(ipv6Address)) {
      console.error("From isValidIPv6: Invalid IPv6 format - Not valid IPv6 character(s).")
      return false
    }

    // IPv6 address must not start and end with a single colon.
    if ((ipv6Address[0] === ":" && ipv6Address.slice(0,2) !== "::") || (ipv6Address[ipv6Address.length - 1] === ":" && ipv6Address.slice(-2) !== "::")) { 
      console.error("From isValidIPv6: Invalid IPv6 format - Colon used at the beginning or end at the end.")
      return false
    }

    // IPv6 address cannot have more than two contiguous colons.
    regexPattern = /:::/
    if (regexPattern.test(ipv6Address)) {
      console.error("From isValidIPv6: Invalid IPv6 format - Colon used more than twice contiguously.")
      return false      
    }

    // IPv6 address should have only one double-colon in use.
    regexPattern = /::/g
    const dcInstance = ipv6Address.match(regexPattern)
    if (dcInstance !== null) {
      if (dcInstance.length > 1) {
        console.error("From isValidIPv6: Invalid IPv6 format - Double-colon used more than once.")
        return false        
      }
    }

    // IPv6 address should only have a max four hex digits in each segment.
    regexPattern = /[0-9a-f]{1,}/g
    segments = ipv6Address.match(regexPattern)
    if (segments !== null) {
      for (const segment of segments) {
        if (segment.length > 4) {
          console.error("From isValidIPv6: Invalid IPv6 format - A segment can only have a max of four hex digits.")
          return false  
        }
      }
    }

    // If double colon doesn't exist then a valid ipv6 address has an eight groups of segments and should only have a max of 7 colons.
    regexPattern = /::/
    if (!regexPattern.test(ipv6Address)) {
      if (!completeIPv6AddPattern.test(ipv6Address)) {
        console.error("From isValidIPv6: Invalid IPv6 format - IPv6 Address was not in complete format.")
        return false  
      }
    }
    
    // Double-colon can only be used if there's two or more consecutive of segments of all zeros.
    // So segments cannot be more than six.    
    if (regexPattern.test(ipv6Address)) {
      // Get the number of segments.
      segments = ipv6Address.match(/[0-9a-f]{1,4}/g)
      if (segments !== null && segments.length > 6) {
        console.error("From isValidIPv6: Invalid IPv6 format - IPv6 Address with double-colon were not used in proper format.")
        return false  
      }
    }

    // Finally return true if all checkings passed.
    // console.log("Valid IPv6 Address.")
    return true
  }
  

  /**
   * This method expands an abbreviated IPv6 address
   * by adding leading zeros to segment and 
   * turning :: into a segment of zeros.
   * 
   * @param {string} ipv6Address - A string of IPv6 address.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
  static expand(ipv6Address: string): TIPv6ReturnData {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    // Regex pattern.
    // /[0-9a-f]{1,4}/ - Segment of hex digits
    let segments: RegExpMatchArray | null = ipv6Address.match(/[0-9a-f]{1,4}/g)
    let doubleColonPattern: RegExp = /^::$/

    let expandedIPv6: TIPv6ReturnData = {success: true};

    try {
      // Check first if IPv6 Address is valid
      if (!this.isValidIpv6(ipv6Address)) throw new Error("From expand: Invalid IPv6 Address provided.")      

    } catch (error: unknown) {
      expandedIPv6.success = false
      expandedIPv6.error = getErrorMessage(error)
      return expandedIPv6
    }

    // Check if the user input is just ::    
    if (doubleColonPattern.test(ipv6Address)) {
      expandedIPv6.data = "0000:0000:0000:0000:0000:0000:0000:0000"
      return expandedIPv6
    }

    // Add leading zeros if it has to.
    if (segments !== null) {
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].length !== 4) {
          const zerosToPrepend = 4 - segments[i].length;
          segments[i] = "0".repeat(zerosToPrepend) + segments[i]
        }        
      }
    }

    // Turn double colon:: into segments of zeros.
    // Check if double colon(::) exists at the end.
    if (ipv6Address.slice(-2) === "::") {
      // Append segment of zeros until there's eight segments.
      while (segments?.length !== 8) {
        segments?.push("0000")
      }      
    }
    else {
      // Otherwise double colon(::) exists somewhere not at the end.
      // Find the index of the double-colon(::)
      const toInsertAt = ipv6Address.split(":").indexOf("");
      // Keep adding until there's a total of 8 segments.
      while(segments?.length !== 8) {                    
        segments?.splice(toInsertAt, 0, "0000");
      }
    }

    // Update message.
    expandedIPv6.data = segments.join(':')
    // Finally
    return expandedIPv6
  }


  /**
   * This method abbreviates an IPv6 Address
   * by removing leading zeros and turning the longest sequence 
   * of segments of zeros into ::
   * 
   * @param {string} ipv6Address - A string of IPv6 address.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
  static abbreviate(ipv6Address: string): TIPv6ReturnData {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    const abbreviatedIPv6: TIPv6ReturnData = {success: true}

    let segments: Array<string>

    const segmentAllZeroPattern = /^0000$/
    const leadingZeroPattern = /^0+/

    // This pattern assumes the IPv6 Address has no leading zeros.
    const seriesOfZerosPattern: RegExp  = /(0(:0){1,})/g


    // Try to expand the IPv6 first.
    try {
      if (!this.isValidIpv6(ipv6Address)) throw new Error("From abbreviate: Invalid IPv6 address provided.")

      const expandedIPv6 = this.expand(ipv6Address)
      // Set the segments as array.
      if (!expandedIPv6.success) throw new Error("From abbreviate: Expanding part failed.")

      segments = (expandedIPv6.data as string).split(':')

      // Delete leading zeros first.
      for (let index = 0; index < segments.length; index++) {
        
        if (segmentAllZeroPattern.test(segments[index])) {
          segments[index] = "0"
          continue
        }
              
        segments[index] = segments[index].replace(leadingZeroPattern, "")      
      }

      const ipv6String: string = segments.join(":")

      // Get the instances of segments of zeroes if exist.
      const instances: RegExpMatchArray | null = ipv6String.match(seriesOfZerosPattern)
      if (instances !== null) {
        // Get the longest sequence.
        let longestSequence: string = instances[0]
        for (const instance of instances) {
          if (instance.length > longestSequence.length) {
            longestSequence = instance
          }
        }

        // Turn the longest sequence into double-colon(::)
        // Update the data.
        abbreviatedIPv6.data = ipv6String.replace(longestSequence, "::")
        // The replace method above causes more than two of contiguous colons.
        // So perform a replace again.
        abbreviatedIPv6.data = abbreviatedIPv6.data.replace(/:{3,}/, "::")
      }
      else {
        // Otherwise none.
        // Update the data.
        abbreviatedIPv6.data = ipv6String
      }

    } catch (error: unknown) {
      abbreviatedIPv6.success = false
      abbreviatedIPv6.error = getErrorMessage(error)
      return abbreviatedIPv6
    }

    // Finally.    
    return abbreviatedIPv6
  }


  /**
   * This method checks if the input hex string is a valid hex digits.
   * 
   * @param {string} hex - A string of positive hex digits.
   * 
   * @returns {boolean} Boolean
   */
  static isHex(hex: string): boolean {
    // Sanitize user input first.
    hex = hex.trim().toLowerCase()

    // Regex pattern.
    const hexCharsPattern = /[^0-9a-f]/
    

    // Check input first.
    if (hex === undefined || hex === null || hex === "") return false

    const invalidHex: boolean = hexCharsPattern.test(hex)
    if (invalidHex) return false

    // Finally
    return true
  }


  /**
   * This method checks if the input string is a valid binaries.
   * 
   * @param binary - A string of positive binaries.
   * 
   * @returns {boolean} Boolean
   */
  static isBinary(binary: string): boolean {
    // Sanitize user input first.
    binary = binary.trim()

    // Regex pattern.
    const binaryCharsPattern = /[^0-1]/

    // Check input first.
    if (binary === undefined || binary === null || binary === "") return false

    const invalidBinary: boolean = binaryCharsPattern.test(binary)
    if (invalidBinary) return false
    
    // Finally
    return true
  }


  /**
   * This method converts hexadecimals digits to binary.
   * It uses four bits to output each hex digit
   * and does not omit leading zeros.
   * 
   * @param {string} hex - A string of positive hex digits.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
  static toBinary(hex: string): TIPv6ReturnData

  /**
   * This method converts positive integers to binary.
   * 
   * @param {number} integer - Positive integers (integers less than Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
  static toBinary(integer: number): TIPv6ReturnData

  /**
   * This method converts positve integers to binary.
   * 
   * JS version lower than ES2020 does not support BigInt literals.
   * Argument passed to toBinary method must use the following example.
   * 
   * ex.) const integer = BigInt("9007199254740991")
   * 
   * __where__: Positive `integer` argument to `BigInt` constructor is in 
   * `string` format to avoid losing precision of the argument.
   * 
   * @param {bigint} integer - Positive integers (greater than or equal to Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
  static toBinary(integer: bigint): TIPv6ReturnData
  static toBinary(x: string | number | bigint): TIPv6ReturnData {

    let binaries: string = ""

    // Return data
    const binaryData: TIPv6ReturnData = {success: true}

    // Find out which data to work on.
    switch (typeof x) {
      case "string": {
        /*
          This version of the overloaded method converts string hex digit
          to string binaries.
        */

        // Sanitize input data first.
        const inputHex = x.trim().toLowerCase()
        
        // Validate input data first.
        try {
          if (!this.isHex(inputHex)) throw new Error("From toBinary: Invalid hex digits provided.")
        } catch (error:unknown) {
          binaryData.success = false
          binaryData.error = getErrorMessage(error)
          return binaryData
        }
        
        /*
        Because numbers greater than (2 ** 53 - 1) lose precision 
        we have to convert individual hex from input if multiple hex 
        are given rather than the whole hexadecimals in one go.        
        */
        for (const hex of inputHex) {
          // First, convert hex to number
          const decimal = parseInt(hex, 16)

          // Then from number to binary
          const binary = decimal.toString(2)

          /*
            Because toString method does not add leading zeroes
            we have to prepend leading zeroes which is important
            at this part of the process.
          */
          const zeroesToPrepend = 4 - binary.length
          binaries += "0".repeat(zeroesToPrepend) + binary
          
        }        

        // Update return data.
        binaryData.data = binaries
        // Finally
        return binaryData
      }
      case "number": {
        /*
          This version of the overloaded method will convert integers less than
          Number.MAX_SAFE_INTEGER.
        */
        
        const inputInteger: number = x
        
        // Validate input data.
        try {
          if (inputInteger === undefined || inputInteger === null) throw new Error("From toBinary: Did not provide an integer.")
          
          // Must be positive.
          if (inputInteger < 0) throw new Error("From toBinary: Integers must be positive.")

          // This version of the overloaded method rejects integers >= Number.MAX_SAFE_INTEGER (2^53 - 1).
          if (inputInteger >= Number.MAX_SAFE_INTEGER) throw new Error("From toBinary: Must use the method signature for numbers equal or greater than Number.MAX_SAFE_INTEGER.")

        } catch (error: unknown) {
          binaryData.success = false
          binaryData.error = getErrorMessage(error)
          return binaryData
        }

        // Otherwise valid.
        // Convert to binary.
        binaries = inputInteger.toString(2)        

        // Update return data.
        binaryData.data = binaries
        // Finally
        return binaryData
      }
      case "bigint": {
        /*
          This version of the overloaded method will convert integers equal or
          greater than Number.MAX_SAFE_INTEGER.
        */

        const inputInteger: bigint = x

        // Validate input data.
        try {
          if (inputInteger === undefined || inputInteger === null) throw new Error("From toBinary: Did not provide an integer.")
          
          // Must be positive.
          if (inputInteger < BigInt(0)) throw new Error("From toBinary: Integers must be positive.")

          // Input integer must be in BigInt format.
          if (typeof inputInteger !== "bigint") throw new Error("From toBinary: Input integers must be in BigInt format.")

        } catch (error: unknown) {
          binaryData.success = false
          binaryData.error = getErrorMessage(error)
          return binaryData
        }

        // Otherwise valid.
        // Convert to binary.
        binaries = inputInteger.toString(2)        

        // Update return data.
        binaryData.data = binaries
        // Finally
        return binaryData          
      }
      default:
        binaryData.success = false
        binaryData.error = "From toBinary: Invalid data type of input data."
        return binaryData
    }
  }


  /**
   * This method converts a string of binaries into hexadecimals.
   * 
   * @param {string} binary - A string of positive binaries.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
  static toHex(binary: string): TIPv6ReturnData

  /**
   * This method converts positive integers into hexadecimals.
   * 
   * @param {number} integer - Positive integers (integers less than Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */  
  static toHex(integer: number): TIPv6ReturnData

  /**
   * This method converts positive integers into hexadecimals.
   * 
   * @param {bigint} integer - Positive integers (integers equal or greater than Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */    
  static toHex(integer: bigint): TIPv6ReturnData
  static toHex(x: string | number | bigint): TIPv6ReturnData {

    let hexadecimals: string = ""

    // Return data.
    const hexData: TIPv6ReturnData = {success: true}

    switch (typeof x) {
      case "string": {
        /*
          This version of the overloaded method converst a string binaries
          into hexadecimals.
        */

        // Sanitize input data first.
        const inputBinary: string = x.trim()


        // Validate input data.
        try {
          if (!this.isBinary(inputBinary)) throw new Error("From toHex: Provided with invalid binaries.")

          /*
            Because number greater than (2 ** 53 - 1) loses precision we will
            use bigint too.
            Note that the BigInt constructor throws a SyntaxError if argument
            is invalid.
          */
          let decimal: bigint | number 
          
          // Convert binary to decimal form (integer).
          decimal = parseInt(inputBinary, 2)
          if (decimal >= Number.MAX_SAFE_INTEGER) {
            // Update decimal as bigint.
            decimal = BigInt(`0b${inputBinary}`)
          }

          // Convert decimal to hexadecimals.
          hexadecimals = decimal.toString(16)

        } catch (error: unknown) {
          hexData.success = false
          hexData.error = getErrorMessage(error)
          return hexData
        }

        // Update return data.
        hexData.data = hexadecimals
        // Finally
        return hexData
      }
      case "number": {
        /*
          This version of the overloaded method converts positive integer
          (less than Number.MAX_SAFE_INTEGER or 2^53 - 1) into hexadecimals.
        */

        const inputInteger: number = x
        

        // Validate input data first.
        try {
          if (inputInteger === undefined || inputInteger === null) throw new Error("From toHex: Did not provide integers.")

          // Must be positive integers.
          if (inputInteger < 0) throw new Error("From toHex: Must be positive integers.")

          // This version of the overloaded method rejects integers >= Number.MAX_SAFE_INTEGER (2^53 - 1).
          if (inputInteger >= Number.MAX_SAFE_INTEGER) throw new Error("From toHex: Must use the method signature for integers equal or greater than Number.MAX_SAFE_INTEGER.")
        } catch (error: unknown) {
          hexData.success = false
          hexData.error = getErrorMessage(error)
          return hexData
        }

        // Otherwise valid.
        // Convert decimal to hexadecimals.
        hexadecimals = inputInteger.toString(16)

        // Update data return.
        hexData.data = hexadecimals
        // Finally
        return hexData
      }
      case "bigint": {
        /*
          This version of the overloaded method will convert integers equal or
          greater than Number.MAX_SAFE_INTEGER.
        */

        const inputInteger: bigint = x


        // Validate input data.
        try {
          if (inputInteger === undefined || inputInteger === null) throw new Error("From toBinary: Did not provide an integer.")
          
          // Must be positive.
          if (inputInteger < BigInt(0)) throw new Error("From toHex: Integers must be positive.")

          // Input integer must be in bigint format.
          if (typeof inputInteger !== "bigint") throw new Error("From toHex: Input integers must be in bigint format.")

        } catch (error: unknown) {
          hexData.success = false
          hexData.error = getErrorMessage(error)
          return hexData
        }

        // Otherwise valid.
        // Convert decimal to hexadecimals.
        hexadecimals = inputInteger.toString(16)        

        // Update return data.
        hexData.data = hexadecimals
        // Finally
        return hexData
      }        
      default: {
        hexData.success = false
        hexData.error = "From toHex: Received unkown data type."
        return hexData
      }
    }    
  }

  
  /**
   * Converts a string of binaries or hexadecimals to decimal form (integer).
   * 
   * @param {string} binOrHex - A string of binaries or hexadecimals. Must be positive.
   * @param {TBaseNumberSystem} fromBase - A union numbers of `2` and `16`.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `number`.
   */
  static toDecimal(binOrHex: string, fromBase: TBaseNumberSystem): TIPv6ReturnData {
    let decimals: number
    
    // Return data.
    const decimalsData: TIPv6ReturnData = {success: true}


    try {
      switch (fromBase) {
        case 2: {
          // Sanitize input data first.
          const binaries: string = binOrHex.trim()

          // Validate input data.
          if (binaries === undefined || binaries === null || binaries === "" || !this.isBinary(binaries)) {
            throw new Error("From toDecimal: Must provide a valid binaries.");
          }
          
          /*
            This method rejects numbers greater than or equal to 
            Number.MAX_SAFE_INTEGER.
          */
          decimals = parseInt(binaries, 2);
          if (decimals >= Number.MAX_SAFE_INTEGER) throw new Error("From toDecimal: Arguments greater or equal than Number.MAX_SAFE_INTEGER must use other method.")

          // Update data return.
          decimalsData.data = decimals
          break;
        }
        case 16:{
          // Sanitize input data first.
          const hexadecimals: string = binOrHex.trim()

          // Validate input data.
          if (hexadecimals === undefined || hexadecimals === null || hexadecimals === "" || !this.isBinary(hexadecimals)) {
            throw new Error("From toDecimal: Must provide a valid binaries.");
          }
          
          /*
            This method rejects numbers greater than or equal to 
            Number.MAX_SAFE_INTEGER.
          */
          decimals = parseInt(hexadecimals, 16);
          if (decimals >= Number.MAX_SAFE_INTEGER) throw new Error("From toDecimal: Arguments greater or equal than Number.MAX_SAFE_INTEGER must use other method.")

          // Update data return.
          decimalsData.data = decimals
          break;          
        }
      
        default: {
          throw new Error("From toDecimal: Received invalid arguments.")
        }
      }
    } catch (error: unknown) {
      decimalsData.success = false
      decimalsData.error = getErrorMessage(error)
      return decimalsData
    }

    // Finally
    return decimalsData
  }


  /**
   * Converts a string of binaries or hexadecimals to decimal form (Bigint).
   * 
   * @param {string} binOrHex - A string of binaries or hexadecimals. Must be positive.
   * @param {TBaseNumberSystem} fromBase - A union numbers of `2` and `16`.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `bigint`.
   */
  static toBigIntDecimal(binOrHex: string, fromBase: TBaseNumberSystem): TIPv6ReturnData {
    let decimals: bigint
    
    // Return data.
    const decimalsData: TIPv6ReturnData = {success: true}


    try {
      switch (fromBase) {
        case 2: {
          // Sanitize input data first.
          const binaries: string = binOrHex.trim()

          // Validate input data.
          if (binaries === undefined || binaries === null || binaries === "" || !this.isBinary(binaries)) {
            throw new Error("From toDecimal: Must provide a valid binaries.");
          }
          
          // Convert binaries to decimal form (integer).
          decimals = BigInt(`0b${binaries}`)

          // Update data return.
          decimalsData.data = decimals
          break;
        }
        case 16:{
          // Sanitize input data first.
          const hexadecimals: string = binOrHex.trim()

          // Validate input data.
          if (hexadecimals === undefined || hexadecimals === null || hexadecimals === "" || !this.isBinary(hexadecimals)) {
            throw new Error("From toDecimal: Must provide a valid binaries.");
          }
          
          // Convert binaries to decimal form (integer).
          decimals = BigInt(`0x${hexadecimals}`)

          // Update data return.
          decimalsData.data = decimals
          break;          
        }
      
        default: {
          throw new Error("From toDecimal: Received invalid arguments.")
        }
      }
    } catch (error: unknown) {
      decimalsData.success = false
      decimalsData.error = getErrorMessage(error)
      return decimalsData
    }

    // Finally
    return decimalsData
  }  


  /**
   * Initialize the Prefix object of typed `TPrefix`.
   * 
   * @param {string} ipv6Address - A string of IPv6 address.
   * @param {number} prefixLength - An integer range from 0 to 128.
   * @param {number} subnetBits - An integer range from 0 to 128.
   * @param {string} subnetNumber - An optional string param represents the current subnet number (default to zero).
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `TPrefix`.
   */
  static getPrefix(ipv6Address: string, prefixLength: number, subnetBits: number, subnetToFind: string = "0"): TPrefixData {
    /*
      Note
      The subnetToFind (Subnet number or Prefix number) is used to find
      the desired subnet. By default set to zero (subnet zero) and of 
      type string to avoid losing precision.
      The subnetBits specifies the length of the subnet portion. 
    */

    // Declare objects.
    const interfaceID: TInterfaceID = {
      id: "",
      bits: 0,
      firstUsableAddressBin: "",
      lastUsableAddresssBin: ""
    }

    const prefix: TPrefix = {
      id: "", 
      subnetNumber: BigInt(0),
      newPrefixLength: 0,
      networkPortionBin: "",
      subnetPortionBin: "",
      interfaceIdPortion: interfaceID,
      firstUsableAddress: "",
      lastUsableAddresss: "",
    }
    
    // Return data.
    const prefixData: TPrefixData = {success: true}
    
    try {
      // validate input data first.
      if (!this.isValidIpv6(ipv6Address)) {
        // Set the error field (param).
        prefixData.errorFields?.push({field: "ipv6Address", message: "Invalid IPv6 address."})
        throw new Error("From getPrefix: Invalid argument(s) provided.")

      }
      if (prefixLength === undefined || prefixLength === null || prefixLength < 0 || prefixLength >= 128) {
        // Set the error field (param).
        prefixData.errorFields?.push({field: "prefixLenth", message: "Invalid prefix length."})
        throw new Error("From getPrefix: Invalid argument(s) provided.")
      }
      if (subnetBits === undefined || subnetBits === null || subnetBits < prefixLength || subnetBits >= (128 - prefixLength)) {
        // Set the error field (param).
        prefixData.errorFields?.push({field: "subnetBits", message: "Invalid subnet bits."})
        throw new Error("From getPrefix: Invalid argument(s) provided.")
      }
      if (BigInt(subnetToFind) < 0 || BigInt(subnetToFind) > (BigInt(2 ** subnetBits) - BigInt(1))) {
        // Set the error field (param).
        prefixData.errorFields?.push({field: "subnetToFind", message: "Subnet ${subnetToFind} does not exists."})
        throw new Error(`From getPrefix: Invalid argument(s) provided.`)
      }


      // Make sure the IPv6 address is in expanded format.
      const expandedIPv6Address: string = this.expand(ipv6Address).data as string
      // Number of bits.
      const newPrefixLength: number = prefixLength + subnetBits
      // Number of bits.
      const interfaceIdBits: number = 128 - newPrefixLength
      const networkPortionBin: string = (this.#IPv6ToBinary(expandedIPv6Address).data as string).slice(0, prefixLength)
      const subnetNumber: bigint = BigInt(subnetToFind)


      // Initialize the interfaceID object (Host portion).
      interfaceID.bits = interfaceIdBits
      // The id prop is all zeroes (Network address or id in IPv4).
      interfaceID.id = "0".repeat(interfaceIdBits)
      // The first usable address is 1 more than the id.
      interfaceID.firstUsableAddressBin = "1".padStart(interfaceIdBits, "0")
      // The last usable address is all ones in IPv6.
      interfaceID.lastUsableAddresssBin = "1".repeat(interfaceIdBits)

      // Intialize prefix object.
      prefix.subnetNumber = BigInt(subnetNumber)
      prefix.newPrefixLength = newPrefixLength
      prefix.networkPortionBin = networkPortionBin

      // Set the prefix subnet portion binaries.
      const subnetPortionBin: string = subnetNumber.toString(2)
      // Include leading zeroes.
      const zeroesToPrepend = subnetBits - subnetPortionBin.length;
      // If not subnetted then subnet portion is 0.
      if (subnetBits === 0) {
        prefix.subnetPortionBin = "";
      }
      else {
        // Otherwise subnetted.
        prefix.subnetPortionBin = "0".repeat(zeroesToPrepend) + subnetPortionBin
      }

      let toIPv6result;
      // Set the prefix id (Network address or id in IPv4).
      const prefixIdBin = prefix.networkPortionBin + prefix.subnetPortionBin + interfaceID.id
      toIPv6result = this.#BinaryToIPv6(prefixIdBin, false)
      if (!toIPv6result.success) throw new Error(toIPv6result.error)
      prefix.id = toIPv6result.data as string

      // Set the prefix first usable address.
      const prefixFirstAddressBin = prefix.networkPortionBin + prefix.subnetPortionBin + interfaceID.firstUsableAddressBin
      toIPv6result = this.#BinaryToIPv6(prefixFirstAddressBin, false)
      if (!toIPv6result.success) throw new Error(toIPv6result.error)
      prefix.firstUsableAddress = toIPv6result.data as string

      // Set the prefix last usable address.
      const prefixLastAddressBin = prefix.networkPortionBin + prefix.subnetPortionBin + interfaceID.lastUsableAddresssBin      
      toIPv6result = this.#BinaryToIPv6(prefixLastAddressBin, false)
      if (!toIPv6result.success) throw new Error(toIPv6result.error)
      prefix.lastUsableAddresss = toIPv6result.data as string

    } catch (error: unknown) {
      prefixData.success = false
      prefixData.error = getErrorMessage(error)
      return prefixData
    }

    // Finally.
    return prefixData
  }


  /**
   * Converts IPv6 address into string contiguous binaries.
   * 
   * @param ipv6Address - A string of IPv6 address.
   * @param skipArgumentValidation - An optional boolean param default to `true`.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
   static #IPv6ToBinary(ipv6Address: string, skipArgumentValidation: boolean = true): TIPv6ReturnData {
    /*
      Note
      It is up to the method caller to validate input data.
    */

    let binaries: string = ""

    // Return data.
    const binaryData: TIPv6ReturnData = {success: true} 

    // Validate input data first.
    if (skipArgumentValidation === false) {
      if (!this.isValidIpv6(ipv6Address)) {
        binaryData.success = false
        binaryData.error = "From IPv6ToBinary: Invalid IPv6 address."
      }
      return binaryData
    }
    

    for (const hex of ipv6Address.split(":")) {
      binaries += this.toBinary(hex).data
    }

    // Update return data.
    binaryData.data = binaries
    // Finally.
    return binaryData
  }


  /**
   * Converts a string of 128-bit binaries into a string IPv6 address.
   * 
   * @param binaries - A string of binaries.
   * @param skipArgumentValidation - An optional boolean param default to `true`.
   * 
   * @returns {object} An `object` with three properties: `success`, `error` and `data`.
   * 
   * @property `data` is of type `string`.
   */
  static #BinaryToIPv6(binaries: string, skipArgumentValidation: boolean = true): TIPv6ReturnData {
    /*
      Note
      It is up to the method caller to validate input data.
    */

    let ipv6Address: string
    let segmentArray: Array<string> = []
    let hexadecimals: string;

    // Return data.
    const ipv6AddressData: TIPv6ReturnData = {success: true} 

    // Input data validation.
    if (skipArgumentValidation === false) {
      ipv6AddressData.success = false

      if (!this.isBinary(binaries)) {
        ipv6AddressData.error = "From BinaryToIPv6: Invalid IPv6 address."
      }

      if (binaries.length !== 128 || binaries.length % 128 !== 0) {
        ipv6AddressData.error = "From BinaryToIPv6: Input binaries must be 128-bit long."
      }

      return ipv6AddressData
    }
    
    // Convert first to hexadecimals.
    hexadecimals = this.toHex(binaries).data as string

    // Get each segment.
    for (let index = 0; index < hexadecimals.length; index += 4) {
      // Extract four hex on each iteration.
      const hexChars: Array<string> = hexadecimals.split("")
      const segment = hexChars.splice(index, 4, "ex").join("")
      segmentArray.push(segment)
    }

    // Join array of segments into a single string.
    ipv6Address = segmentArray.join(":")

    // Update return data.
    ipv6AddressData.data = ipv6Address
    // Finally.
    return ipv6AddressData
  }  







}

export default IPv6