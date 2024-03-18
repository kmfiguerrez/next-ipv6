export class Ipv6 {

  /**
   * This method is used to check format of user input IPv6 Address.
   */
  static isValidIpv6(ipv6Address: string): boolean {

    const ipv6Chars = new Set<string>([
      ":", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "a", "b", "c", "d", "e", "f"
    ])

    // Check if user input uses valid ipv6 characters.
    for (const char of ipv6Address) {
      if (!ipv6Chars.has(char)) return false
    }

    // If not using :: for all zeros.
    if (ipv6Address.length !== 2) {
      // An ipv6 must not start and end with a colon.
      if (ipv6Address[0] === ":" || ipv6Address[ipv6Address.length - 1] === ":") {
        return false
      }


    }

    return true
  }
}