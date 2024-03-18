type TIPv6Result = {
  success: boolean
  message: string
}


export class IPv6 {

  /**
   * This method is used to check format of user input IPv6 Address.
   * 
   * It performs a sequence of checkings where each checking must passed
   * to get to the next one, otherwise will return false.
   */
  static isValidIpv6(ipv6Address: string): boolean {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    // [0-9a-f]{1,4} means a segment of at least one and max at four of hex digits.
    // [0-9a-f]{1,4}: means a segment that ends with a semi-colon.
    // ([0-9a-f]{1,4}:){7} means a segment ends with a semi-colon, seven times.
    const completeIPv6AddPattern = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/
    let segments: RegExpMatchArray | null
    let regexPattern: RegExp
    const ipv6Char = new Set<string>([
      ":", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "a", "b", "c", "d", "e", "f"
    ])



    if (ipv6Address === undefined || ipv6Address === null || ipv6Address === "") {
      console.error("Invalid IPv6 format: IPv6 Address cannot be undefined, null nor an empty string.")
      return false
    }

    // Check if user input uses valid ipv6 characters.
    for (const char of ipv6Address) {
      if (!ipv6Char.has(char)) {
        console.error("Invalid IPv6 format: Not valid IPv6 character(s).")
        return false
      }
    }

    // IPv6 address must not start and end with a single colon.
    if ((ipv6Address[0] === ":" && ipv6Address.slice(0,2) !== "::") || (ipv6Address[ipv6Address.length - 1] === ":" && ipv6Address.slice(-2) !== "::")) { 
      console.error("Invalid IPv6 format: Colon used at the beginning or end at the end.")
      return false
    }

    // IPv6 address cannot have more than two contiguous colons.
    regexPattern = /:::/
    if (regexPattern.test(ipv6Address)) {
      console.error("Invalid IPv6 format: Colon used more than twice contiguously.")
      return false      
    }

    // IPv6 address should have only one double-colon in use.
    regexPattern = /::/g
    const dcInstance = ipv6Address.match(regexPattern)
    if (dcInstance !== null) {
      if (dcInstance.length > 1) {
        console.error("Invalid IPv6 format: Double-colon used more than once.")
        return false        
      }
    }

    // IPv6 address should only have a max four hex digits in each segment.
    regexPattern = /[0-9a-f]{1,}/g
    segments = ipv6Address.match(regexPattern)
    if (segments !== null) {
      for (const segment of segments) {
        if (segment.length > 4) {
          console.error("Invalid IPv6 format: A segment can only have a max of four hex digits.")
          return false  
        }
      }
    }

    // If double colon doesn't exist then a valid ipv6 address has an eight groups of segments and should only have a max of 7 colons.
    // Otherwise used, then double-colon can only be used if there's two or more consecutive of segments of all zeros.
    // So segments cannot be more than six.
    regexPattern = /::/
    if (!regexPattern.test(ipv6Address)) {
      if (!completeIPv6AddPattern.test(ipv6Address)) {
        console.error("Invalid IPv6 format: IPv6 Address was not in complete format.")
        return false  
      }
    }
    else {
      // Get the number of segments.
      segments = ipv6Address.match(/[0-9a-f]{1,4}/g)
      if (segments !== null && segments.length > 6) {
        console.error("Invalid IPv6 format: IPv6 Address with double-colon were not used in proper format.")
        return false  
      }
    }
    // Finally return true if all checkings passed.
    console.log("Valid IPv6 Address.")
    return true
  }
  

  /**
   * This method expands an abbreviated IPv6 address.
   * By Adding leading zeros to segment.
   * Turning :: into a segment of zeros.
   */
  static expand(ipv6Address: string): TIPv6Result {
    // Sanitize user input first.
    ipv6Address = ipv6Address.trim().toLowerCase()

    // /[0-9a-f]{1,4}/ - Segment of hex digits
    let segments: RegExpMatchArray | null = ipv6Address.match(/[0-9a-f]{1,4}/g)
    let doubleColonPattern: RegExp = /^::$/
    const expandedIPv6: TIPv6Result = {success: true, message: ""}    

    try {
      // Check first if IPv6 Address is valid
      if (!this.isValidIpv6(ipv6Address)) throw new Error("Invalid IPv6 Address")      

    } catch (error: unknown) {

      expandedIPv6.success = false
      expandedIPv6. message = "Invalid IPv6 Address"      
      return expandedIPv6

    }

    // Check if the user input is just ::    
    if (doubleColonPattern.test(ipv6Address)) {
      expandedIPv6.message = "0000:0000:0000:0000:0000:0000:0000:0000"
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
    expandedIPv6.message = segments.join(':')
    return expandedIPv6

  }
}