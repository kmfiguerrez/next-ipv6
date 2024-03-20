type IPv6ReturnData = {
  success: boolean
  data?: string
  error?: string
} 

export class IPv6 {

  /**
   * This method is used to check format of user input IPv6 Address.
   * 
   * It performs a sequence of checkings where each checking must passed
   * to get to the next one, otherwise will return false.
   * 
   * @param {string} ipv6Address - A string of IPv6 address.
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
   * @returns {object} An object with three properties: success, error and data.
   * 
   */
  static expand(ipv6Address: string): IPv6ReturnData {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    // Regex pattern.
    // /[0-9a-f]{1,4}/ - Segment of hex digits
    let segments: RegExpMatchArray | null = ipv6Address.match(/[0-9a-f]{1,4}/g)
    let doubleColonPattern: RegExp = /^::$/

    const expandedIPv6: IPv6ReturnData = {success: true};

    try {
      // Check first if IPv6 Address is valid
      if (!this.isValidIpv6(ipv6Address)) throw new Error("From expand: Invalid IPv6 Address provided.")      

    } catch (error: unknown) {
      if (error instanceof RangeError) {
        expandedIPv6.success = false
        expandedIPv6.error = error.message
      }
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
   * @returns {object} An object with three properties: success, error and data.
   */
  static abbreviate(ipv6Address: string): IPv6ReturnData {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    const abbreviatedIPv6: IPv6ReturnData = {success: true}

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

      // Get the instances of segments of zeros.
      const ipv6String: string = segments.join(":")
      const instances: RegExpMatchArray | null = ipv6String.match(seriesOfZerosPattern)
      // Get the longest sequence.
      let longestSequence: string
      if (instances !== null) {
        longestSequence = instances[0]
        for (const instance of instances) {
          if (instance.length > longestSequence.length) {
            longestSequence = instance
          }
        }
      }
      else {
        throw new Error("Couldn't get the instaces of segments of zeros.")
      }

      // Turn the longest sequence into double-colon(::)
      // Update the message.
      abbreviatedIPv6.data = ipv6String.replace(longestSequence, "::")
      // The replace method above causes more than two of contiguous colons.
      // So perform a replace again.
      abbreviatedIPv6.data = abbreviatedIPv6.data.replace(/:{3,}/, "::")


    } catch (error: unknown) {
      if (error instanceof Error) {
        abbreviatedIPv6.success = false
        abbreviatedIPv6.error = error.message
      }
      return abbreviatedIPv6
    }

    // Finally.    
    return abbreviatedIPv6
  }


  /**
   * This method checks if the input hex string is a valid hex digits.
   * 
   * @param {string} hex - A string of hex digits.
   * 
   * @returns {boolean} Boolean
   */
  static isHex(hex: string): boolean {
    // Sanitize user input first.
    hex = hex.trim().toLowerCase()

    // Regex pattern.
    const hexCharsPattern = /^[0-9a-f]/
    

    // Check input first.
    if (hex === undefined || hex === null || hex === "") return false

    const invalidHex: boolean = hexCharsPattern.test(hex)
    if (invalidHex) return false

    // Finally
    return true
  }








}