import { ArgumentError } from "./custom-error"
import { getErrorMessage } from "./error-message"


type THexObj = {
  hexadecimals: string
  includeLeadingZeroes: boolean
}

type TBinObj = {
  binaries: string
  includeLeadingZeroes: boolean  
}

/**
 * This type is used in IPv6 static getPrefix method.
 * 
 * @property `errorFields` is the param list of getPrefix method.
 */
export type TPrefixData = {
  data?: TPrefix
  errorFields: Array<TParamError>
}


/**
 * This type is used in IPv6 static getPrefix method.
 * 
 * @property `field` is a parameter name.
 * @property `message` is an error message.
 */
export type TParamError = {
  field: string
  message: string
}


type TBaseNumberSystem = 2 | 16

/**
 * @property `id` is string of binaries.
 * @property `firstUsableAddressBin` is string of binaries.
 * @property `lastUsableAddresssBin` is string of binaries.
 */
export type TInterfaceID = {
  id: string
  bits: number
  firstUsableAddressBin: string
  lastUsableAddresssBin: string
}


/**
 * @property `id` is a string of hexadecimals.
 * @property `networkPortionBin` is a string of binaries.
 * @property `subnetPortionBin` is a string of binaries.
 * @property `subnetBits` specifies the length of the `subnetPortionBin`.
 */
export type TPrefix = {
  id: string
  subnetNumber: bigint
  networkPortionBin: string
  subnetPortionBin: string
  subnetBits: number
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
   * @returns {string} A string of expanded IPv6 address.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static expand(ipv6Address: string): string {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    // Regex pattern.
    // /[0-9a-f]{1,4}/ - Segment of hex digits
    let segments: RegExpMatchArray | null = ipv6Address.match(/[0-9a-f]{1,4}/g)
    let doubleColonPattern: RegExp = /^::$/

    // Return data.
    let expandedIPv6: string


    // Check first if IPv6 Address is valid
    if (!this.isValidIpv6(ipv6Address)) throw new ArgumentError("From expand: Invalid IPv6 Address provided.")      

    // Check if the user input is just ::    
    if (doubleColonPattern.test(ipv6Address)) {
      expandedIPv6 = "0000:0000:0000:0000:0000:0000:0000:0000"
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
    expandedIPv6 = segments.join(':')
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
   * @returns {string} A string of abbreviated IPv6 address.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static abbreviate(ipv6Address: string): string {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()
    
    // Regex pattern.
    const segmentAllZeroPattern = /^0000$/
    const leadingZeroPattern = /^0+/
    // This pattern assumes the IPv6 Address has no leading zeros.
    const seriesOfZerosPattern: RegExp  = /(0(:0){1,})/g

    let segments: Array<string>

    // Return data.
    let abbreviatedIPv6: string    


    // Try to expand the IPv6 first.
    try {
      /*
        Input data validation of this method relies on Expand method because
        it also validates the same argument which is the IPv6 addresss of
        type string. This way avoids slowing down the application by not
        having the same data validation.
      */      
      // if (!this.isValidIpv6(ipv6Address)) throw new Error("From abbreviate: Invalid IPv6 address provided.")

      const expandedIPv6 = this.expand(ipv6Address)
      // Set the segments as array.

      segments = expandedIPv6.split(':')

      // Delete leading zeros first.
      for (let index = 0; index < segments.length; index++) {
        
        if (segmentAllZeroPattern.test(segments[index])) {
          segments[index] = "0"
          continue
        }
              
        segments[index] = segments[index].replace(leadingZeroPattern, "")      
      }

      // Combine the segments into a single string as IPv6 address.
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
        // Update the return data.
        abbreviatedIPv6 = ipv6String.replace(longestSequence, "::")
        // The replace method above causes more than two of contiguous colons.
        // So perform a replace again.
        abbreviatedIPv6 = abbreviatedIPv6.replace(/:{3,}/, "::")
      }
      else {
        // Otherwise none.
        // Update the return data.
        abbreviatedIPv6 = ipv6String
      }

    } catch (error: unknown) {
      throw new ArgumentError("From abbreviate: Expanding Part Failed.")
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
   * Validates if type string integers is valid.
   * 
   * @param {string} integers - Integers in string format.
   * 
   * @returns Boolean
   */
  static isDecimal(integers: string) {
    // Sanitize user input first.
    integers = integers.trim()

    // Regex pattern.
    const decimalPattern = /[^0-9]/


    // Check input first.
    if (integers === undefined || integers === null || integers === "") return false    

    const invalidDecimal: boolean = decimalPattern.test(integers)
    if (invalidDecimal) return false

    // Finally
    return true    
  }

  /**
   * This method converts hexadecimals digits to binary.
   * 
   * __Note__: This method can also convert hexadecimals greater than
   * `Number.MAX_SAFE_INTEGER`.
   * 
   * @param {THexObj} hex - An `object` with two properties: `hexadecimals` and `includeLeadingZeroes`.
   * 
   * @returns {string} A string binaries.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static toBinary(hex: THexObj): string

  /**
   * This method converts positive integers to binary.
   * 
   * @param {number} integer - Positive integers (integers less than Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {string} A string binaries.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static toBinary(integer: number): string

  /**
   * This method converts positve integers to binary.
   * 
   * JS version lower than ES2020 does not support BigInt literals.
   * Argument passed to toBinary method must use the following example.
   * 
   * ex.) `const integer = BigInt("9007199254740991")`
   * 
   * __where__: Positive `integer` argument to `BigInt` constructor is in 
   * `string` format to avoid losing precision of the argument.
   * 
   * @param {bigint} integer - Positive integers (greater than or equal to Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {string} A string binaries.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static toBinary(integer: bigint): string
  static toBinary(x: THexObj | number | bigint): string {
    // Return data
    let binaries: string = ""


    // Find out which data to work on.
    switch (typeof x) {
      case "object": {
        /*
          This version of the overloaded method converts string hex digit
          to string binaries.
        */

        // Regex pattern.
        const leadingZeroPattern = /^0+/

        // Sanitize input data first.
        const inputHex = x.hexadecimals.trim().toLowerCase()


        // Validate input data first.
        if (!this.isHex(inputHex)) throw new ArgumentError("From toBinary: Invalid hex digits provided.")
        
        /*
        Because numbers greater than (2 ** 53 - 1) lose precision 
        we have to convert individual hex from input if multiple hex 
        are given rather than the whole hexadecimals in one go.        
        */
        for (const hex of inputHex) {
          // First, convert hex to number
          const decimal: number = parseInt(hex, 16)

          // Then from number to binary
          const binary: string = decimal.toString(2)

          /*
            Because toString method does not add leading zeroes
            we have to prepend leading zeroes which is important
            at this part of the process.
          */
          const zeroesToPrepend = 4 - binary.length
          binaries += "0".repeat(zeroesToPrepend) + binary
          
        }

        /*
          Leading zeroes does not affect the final value of binaries.
          Can be omitted by default in this method.
        */
        if (x.includeLeadingZeroes === false) {
          binaries = binaries.replace(leadingZeroPattern, "")
        }

        // Finally
        return binaries
      }
      case "number": {
        /*
          This version of the overloaded method will convert integers less than
          Number.MAX_SAFE_INTEGER.
        */
        
        const inputInteger: number = x
        
        // Validate input data.
        if (inputInteger === undefined || inputInteger === null) throw new ArgumentError("From toBinary: Did not provide an argument.")

        // Must be an integer.
        if (!Number.isInteger(inputInteger)) throw new ArgumentError("From toBinary: Must be an integer.")

        // Must be positive.
        if (inputInteger < 0) throw new ArgumentError("From toBinary: Argument integer must be positive.")

        // This version of the overloaded method rejects integers >= Number.MAX_SAFE_INTEGER (2^53 - 1).
        if (inputInteger >= Number.MAX_SAFE_INTEGER) throw new ArgumentError("From toBinary: Must use the method signature for numbers equal or greater than Number.MAX_SAFE_INTEGER.")


        // Otherwise valid.
        // Convert to binary.
        binaries = inputInteger.toString(2)        

        // Finally
        return binaries
      }
      case "bigint": {
        /*
          This version of the overloaded method will convert integers equal or
          greater than Number.MAX_SAFE_INTEGER.
        */

        const inputInteger: bigint = x

        // Validate input data.
        if (inputInteger === undefined || inputInteger === null) throw new ArgumentError("From toBinary: Did not provide an argument.")
        
        // Must be positive.
        if (inputInteger < BigInt(0)) throw new ArgumentError("From toBinary: Argument integers must be positive.")

        // Input integer must be in BigInt format.
        if (typeof inputInteger !== "bigint") throw new ArgumentError("From toBinary: Input integers must be in BigInt format.")

        // Otherwise valid.
        // Convert to binary.
        binaries = inputInteger.toString(2)        

        // Finally
        return binaries         
      }
      default:
        throw new ArgumentError("From toBinary: Received invalid data type.")        
    }
  }


  /**
   * This method converts a string of binaries into hexadecimals.
   * 
   * __Note__: This method can also convert binaries greater than
   * `Number.MAX_SAFE_INTEGER`.
   * 
   * @param {TBinObj} binary - An `object` with two properties: `binaries` and `includeLeadingZeroes`.
   * 
   * @returns {string} A string of hexadecimals.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static toHex(binary: TBinObj): string

  /**
   * This method converts positive integers into hexadecimals.
   * 
   * @param {number} integer - Positive integers (integers less than Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {string} A string of hexadecimals.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */  
  static toHex(integer: number): string

  /**
   * This method converts positive integers into hexadecimals.
   * 
   * @param {bigint} integer - Positive integers (integers equal or greater than Number.MAX_SAFE_INTEGER or 2^53 - 1).
   * 
   * @returns {string} A string of hexadecimals.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */    
  static toHex(integer: bigint): string
  static toHex(x: TBinObj | number | bigint): string {
    // Return data.
    let hexadecimals: string = ""

    
    // Determine which data type to work on.
    switch (typeof x) {
      case "object": {
        /*
          This version of the overloaded method converst a string binaries
          into hexadecimals.
        */

        // Regex pattern.
        const leadingZeroPattern = /^0+/

        // Sanitize input data first.
        const inputBinary: string = x.binaries.trim()


        // Validate input data.
        try {
          if (!this.isBinary(inputBinary)) throw new ArgumentError("From toHex: Provided with invalid binaries.")

          /*
            The private static BinaryToHex is used instead of the 
            built-in methods is because of to include leading zeroes
            and built-in methods don't do that.
          */
          hexadecimals = this.BinaryToHex(inputBinary)

        } catch (error: unknown) {
          throw new ArgumentError(`${getErrorMessage(error)}`)
        }

        /*
          Leading zeroes does not affect the final value of hexadecimals.
          Can be omitted by in this method.
        */
          if (x.includeLeadingZeroes === false) {
            hexadecimals = hexadecimals.replace(leadingZeroPattern, "")
          }

        // Finally
        return hexadecimals
      }
      case "number": {
        /*
          This version of the overloaded method converts positive integer
          (less than Number.MAX_SAFE_INTEGER or 2^53 - 1) into hexadecimals.
        */
        const inputInteger: number = x
        

        // Validate input data first.
        if (inputInteger === undefined || inputInteger === null) throw new ArgumentError("From toHex: Did not provide integers.")

        // Must be an integer.
        if (!Number.isInteger(inputInteger)) throw new ArgumentError("From toHex: Must be an integer.")

        // Must be positive integers.
        if (inputInteger < 0) throw new ArgumentError("From toHex: Must be positive integers.")

        // This version of the overloaded method rejects integers >= Number.MAX_SAFE_INTEGER (2^53 - 1).
        if (inputInteger >= Number.MAX_SAFE_INTEGER) throw new ArgumentError("From toHex: Must use the method signature for integers equal or greater than Number.MAX_SAFE_INTEGER.")

        // Otherwise valid.
        // Convert decimal to hexadecimals.
        hexadecimals = inputInteger.toString(16)

        // Finally
        return hexadecimals
      }
      case "bigint": {
        /*
          This version of the overloaded method will convert integers equal or
          greater than Number.MAX_SAFE_INTEGER.
        */

        const inputInteger: bigint = x


        // Validate input data.
        try {
          if (inputInteger === undefined || inputInteger === null) throw new ArgumentError("From toBinary: Did not provide an integer.")
          
          // Must be positive.
          if (inputInteger < BigInt(0)) throw new ArgumentError("From toHex: Integers must be positive.")

          // Input integer must be in bigint format.
          if (typeof inputInteger !== "bigint") throw new ArgumentError("From toHex: Input integers must be in bigint format.")

        } catch (error: unknown) {
          throw new ArgumentError(`From toHex: ${getErrorMessage(error)}`)
        }

        // Otherwise valid.
        // Convert decimal to hexadecimals.
        hexadecimals = inputInteger.toString(16)        

        // Finally
        return hexadecimals
      }        
      default: {
        throw new ArgumentError(`From toHex: Received invalid data type.`)
      }
    }    
  }


  /**
   * Converts a string binaries into hexadecimals.
   * 
   * __Notes__: 
   * - This method include leading zeroes.
   * - May throw an `ArgumentError` exception if `skipArgumentValidation`
   * param is set to `false`.
   * 
   * @param {string} binary - A string of binaries.
   * @param {boolean} skipArgumentValidation - An optional boolean param default to `true`.
   * 
   * @returns {string}  A string of hexadecimals
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static BinaryToHex(binary: string, skipArgumentValidation: boolean = true) {
    /*
      Note
      It is up to the method caller to validate input data.
      This method is created because JS built-in methods 
      do not take leading zeroes into account when converting
      a string of binaries into hexadecimals.
    */

    // Sanitize input data first.
    binary = binary.trim()

    const divisibleByFour: boolean = binary.length % 4 === 0

    const nibbles: Array<string> = []
    // Return data.
    let hexadecimals: string = ""


    /*
      Validate input data. Disabled by default. 
      It's up to the method caller.
    */
    if (skipArgumentValidation == false) {
      if (!this.isBinary(binary)) throw new ArgumentError("From ConvertBinaryToHex: Invalid binaries provided.");
    }

    // Check if not divisible by four.
    if (!divisibleByFour) {
      // Extract the first x bits.
      const bits: number = binary.length % 4
      // Turn it to hex and append it to the array of nibbles.
      const extractedBin: string = binary.slice(0, bits)
      const integer = parseInt(extractedBin, 2)
      const hex: string = integer.toString(16)
      nibbles.push(hex)

      // Then remove the extracted bits to binary.
      binary = binary.slice(bits)
    }

    // When binary is now divisible by four.
    for (let index = 0; index < binary.length; index += 4) {
      // Turn string binaries into array because string doesn't have a
      // splice method.
      const tempBinArray: Array<string> = binary.split("")
      // Extract four bits on each iteration.
      const nibble: string = tempBinArray.splice(index, 4, "del").join("")
      // Convert four bits to decimal form (integer).
      const integer: number = parseInt(nibble, 2)
      // Convert decimal to hexadecimals.
      const hex: string = integer.toString(16)
      // console.log(`Bits: ${nibble} - Dec: ${integer} - Hex: ${hex}`)

      // Append hex to the array of nibbles.
      nibbles.push(hex)
    }

    // Turn Array of nibbles into a single string.
    hexadecimals = nibbles.join("")

    // Finally
    return hexadecimals
  }  
  

  /**
   * Converts a string of binaries or hexadecimals to decimal form (integer).
   * 
   * @param {string} binOrHex - A string of binaries or hexadecimals. Must be positive.
   * @param {TBaseNumberSystem} fromBase - A union numbers of `2` and `16`.
   * 
   * @returns {number} A positive integer.
   * 
   * @throws `ArgumentError` is thrown if arguments is invalid.
   */
  static toDecimal(binOrHex: string, fromBase: TBaseNumberSystem): number {
    
    // Return data.
    let decimals: number

    // Determine what base system number to work on.
    switch (fromBase) {
      case 2: {
        // Sanitize input data first.
        const binaries: string = binOrHex.trim()

        // Validate input data.
        if (binaries === undefined || binaries === null || binaries === "" || !this.isBinary(binaries)) {
          throw new ArgumentError("From toDecimal: Must provide a valid binaries.");
        }
        
        /*
          This method rejects numbers greater than or equal to 
          Number.MAX_SAFE_INTEGER.
        */
        decimals = parseInt(binaries, 2);
        if (decimals >= Number.MAX_SAFE_INTEGER) throw new ArgumentError("From toDecimal: Arguments greater or equal than Number.MAX_SAFE_INTEGER must use other method.")

        break;
      }
      case 16:{
        // Sanitize input data first.
        const hexadecimals: string = binOrHex.trim()

        // Validate input data.
        if (hexadecimals === undefined || hexadecimals === null || hexadecimals === "" || !this.isHex(hexadecimals)) {
          throw new ArgumentError("From toDecimal: Must provide a valid hexadecimals.");
        }
        
        /*
          This method rejects numbers greater than or equal to 
          Number.MAX_SAFE_INTEGER.
        */
        decimals = parseInt(hexadecimals, 16);
        if (decimals >= Number.MAX_SAFE_INTEGER) throw new ArgumentError("From toDecimal: Arguments greater or equal than Number.MAX_SAFE_INTEGER must use other method.")

        break;          
      }
      default: {
        throw new ArgumentError("From toDecimal: Received invalid number base system.")
      }
    }


    // Finally
    return decimals
  }


  /**
   * Converts a string of binaries or hexadecimals to decimal form (Bigint).
   * 
   * @param {string} binOrHex - A string of binaries or hexadecimals. Must be positive.
   * @param {TBaseNumberSystem} fromBase - A union numbers of `2` and `16`.
   * 
   * @returns {bigint} A positive BigInteger.
   * 
   * @throws `ArgumentError` is thrown if arguments is invalid.
   */
  static toBigIntDecimal(binOrHex: string, fromBase: TBaseNumberSystem): bigint {
    
    // Return data.
    let decimals: bigint

    // Determine what base system number to work on.
    try {
      switch (fromBase) {
        case 2: {
          // Sanitize input data first.
          const binaries: string = binOrHex.trim()

          // Validate input data.
          if (binaries === undefined || binaries === null || binaries === "" || !this.isBinary(binaries)) {
            throw new ArgumentError("From toDecimal: Must provide a valid binaries.");
          }
          
          // Convert binaries to decimal form (integer).
          decimals = BigInt(`0b${binaries}`)

          break;
        }
        case 16:{
          // Sanitize input data first.
          const hexadecimals: string = binOrHex.trim()

          // Validate input data.
          if (hexadecimals === undefined || hexadecimals === null || hexadecimals === "" || !this.isHex(hexadecimals)) {
            throw new ArgumentError("From toDecimal: Must provide a valid hexadecimals.");
          }
          
          // Convert binaries to decimal form (integer).
          decimals = BigInt(`0x${hexadecimals}`)

          break;          
        }
      
        default: {
          throw new Error("Received invalid number base system.")
        }
      }
    } catch (error: unknown) {
      throw new ArgumentError(`From toDecimal: ${getErrorMessage(error)}.`)
    }

    // Finally
    return decimals
  }  


  /**
   * Get the Prefix (subnet).
   * 
   * @param {string} ipv6Address - A string of IPv6 address.
   * @param {number} prefixLength - An integer range from 0 to 128.
   * @param {number} subnetBits - An integer range from 0 to (128 - prefixLength).
   * @param {string} subnetToFind - An optional string param represents the current subnet number (default to zero).
   * 
   * @returns {object} An `object` with two optional properties: `data` and `errorFields`.
   * 
   * @property `data` is of type `TPrefix`. It is initialized if this method completes successfully.
   * @property `errorFields` is an array of parameters of `getPrefix` method. It is not empty if this method fails to complete.
   * 
   */
  static getPrefix(ipv6Address: string, prefixLength: number, subnetBits: number, subnetToFind: bigint = BigInt(0)): TPrefixData {
    /*
      Note
      The subnetToFind (Subnet number or Prefix number) is used to find
      the desired subnet number. By default set to zero (subnet zero) and of 
      type string to avoid losing precision. It is also used to determine
      the value of the subnet portion.
      The subnetBits specifies the length (Up to what place value to use) 
      of the subnet portion. 
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
      subnetBits: subnetBits,
      interfaceIdPortion: interfaceID,
      firstUsableAddress: "",
      lastUsableAddresss: "",
    }
    
    // Return data.
    const prefixData: TPrefixData = {
      errorFields: []
    }

    
    try {
      // validate input data first.
      if (!this.isValidIpv6(ipv6Address)) {
        // Set the error field (param).
        prefixData.errorFields.push({field: "ipv6Address", message: "Invalid IPv6 address."})
      }
      if (prefixLength === undefined || prefixLength === null || prefixLength < 0 || prefixLength >= 128) {
        // Set the error field (param).
        prefixData.errorFields.push({field: "prefixLenth", message: "Invalid prefix length."})
      }
      if (subnetBits === undefined || subnetBits === null || subnetBits < 0 || subnetBits >= (128 - prefixLength)) {
        // Set the error field (param).
        prefixData.errorFields.push({field: "subnetBits", message: "Invalid subnet bits."})
      }
      if (subnetToFind < 0 || subnetToFind > (BigInt(2 ** subnetBits) - BigInt(1))) {
        // Set the error field (param).
        prefixData.errorFields.push({field: "subnetToFind", message: `Subnet ${subnetToFind} does not exists.`})
      }
      // Throw error if there are.
      if (prefixData.errorFields && prefixData.errorFields.length > 0) {
        throw new ArgumentError(`From getPrefix: Invalid argument(s) provided.`)
      }


      // Make sure the IPv6 address is in expanded format.
      const expandedIPv6Address: string = this.expand(ipv6Address)
      // Number of bits.
      const newPrefixLength: number = prefixLength + subnetBits
      // Number of bits.
      const interfaceIdBits: number = 128 - newPrefixLength
      // Get the network portion binary.
      const networkPortionBin: string = this.#IPv6ToBinary(expandedIPv6Address, false).slice(0, prefixLength)
      const subnetNumber: bigint = subnetToFind


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

      // Set the prefix id (Network address or id in IPv4).
      const prefixIdBin = prefix.networkPortionBin + prefix.subnetPortionBin + interfaceID.id
      prefix.id = this.#BinaryToIPv6(prefixIdBin, false)

      // Set the prefix first usable address.
      const prefixFirstAddressBin = prefix.networkPortionBin + prefix.subnetPortionBin + interfaceID.firstUsableAddressBin
      prefix.firstUsableAddress = this.#BinaryToIPv6(prefixFirstAddressBin, false)

      // Set the prefix last usable address.
      const prefixLastAddressBin = prefix.networkPortionBin + prefix.subnetPortionBin + interfaceID.lastUsableAddresssBin      
      prefix.lastUsableAddresss = this.#BinaryToIPv6(prefixLastAddressBin, false)

    } catch (error: unknown) {
      // if (error instanceof SyntaxError) {
      //   throw new ArgumentError(`From getPrefix: ${getErrorMessage(error)}`)
      // }
      
      // if (error instanceof ArgumentError) {
      //   throw new ArgumentError(getErrorMessage(error))
      // }
      return prefixData
    }

    // Update return data.
    prefixData.data = prefix

    // Finally.
    return prefixData
  }


  /**
   * Converts a string of expanded IPv6 address into string of 
   * contiguous binaries.
   * 
   * __Note__:
   * - `ArgumentError` exception is thrown if argument `ipv6Adress` is not in expanded form. 
   * - May throw an `ArgumentError` exception if `skipArgumentValidation`
   * param is set to `false`.
   * 
   * @param ipv6Address - A string of expanded IPv6 address.
   * @param skipArgumentValidation - An optional boolean param default to `true`.
   * 
   * @returns {string} A string of binaries.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
   static #IPv6ToBinary(ipv6Address: string, skipArgumentValidation: boolean = true): string {
    /*
      Note
      It is up to the method caller to validate input data.
    */

    // Return data.
    let binaries: string = ""

    try {
      // Validate input data first.
      if (skipArgumentValidation === false) {
        if (!this.isValidIpv6(ipv6Address)) throw new Error("From IPv6ToBinary: Invalid IPv6 address.")
      }
      
      for (const hex of ipv6Address.split(":")) {
        binaries += this.toBinary({hexadecimals: hex, includeLeadingZeroes: true})
      }      
    } catch (error: unknown) {
      if (error instanceof ArgumentError) throw new ArgumentError(getErrorMessage(error))

      throw new ArgumentError(getErrorMessage(error))
    }

    // Finally.
    return binaries
  }


  /**
   * Converts a string of 128-bit binaries into a string IPv6 address.
   * 
   * __Note__: 
   * May throw an `ArgumentError` exception if `skipArgumentValidation`
   * param is set to `false`.
   * 
   * @param {string} binary - A string of binaries.
   * @param {boolean} skipArgumentValidation - An optional boolean param default to `true`.
   * 
   * @returns {string} A string IPv6 address.
   * 
   * @throws `ArgumentError` is thrown if argument is invalid.
   */
  static #BinaryToIPv6(binary: string, skipArgumentValidation: boolean = true): string {
    /*
      Note
      It is up to the method caller to validate input data.
    */

    let segmentArray: Array<string> = []
    let hexadecimals: string;

    // Return data.
    let ipv6Address: string

    try {
      // Input data validation.
      if (skipArgumentValidation === false) {
        if (!this.isBinary(binary)) throw new Error("From BinaryToIPv6: Invalid IPv6 address.")

        if (binary.length !== 128 || binary.length % 128 !== 0) {
          throw new RangeError("From BinaryToIPv6: Input binaries must be 128-bit long.")
        }
      }
      
      // Convert first to hexadecimals.
      hexadecimals = this.toHex({binaries: binary, includeLeadingZeroes: true})

      // Get each segment.
      for (let index = 0; index < hexadecimals.length; index += 4) {
        // Extract four hex on each iteration.
        const hexChars: Array<string> = hexadecimals.split("")
        const segment = hexChars.splice(index, 4, "ex").join("")
        segmentArray.push(segment)
      }
    } catch (error: unknown) {
      throw new ArgumentError(getErrorMessage(error))
    }    

    // Join array of segments into a single string.
    ipv6Address = segmentArray.join(":")

    // Finally.
    return ipv6Address
  }  







}

export default IPv6