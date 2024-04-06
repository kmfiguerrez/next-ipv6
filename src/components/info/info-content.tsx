

const IntroContent = () => {
  return (
    <p className=''>
      This app can be used to check your work whenever your're learning or practicing IPv6 subnetting. 
      This is also useful if you're going for the CCNA exam or any other equivalent certifications.
    </p>
  )
}


const HowToUseContent = () => {

  return (
    <ul className='list-inside list-decimal'>
      <li className='mb-1'>
        Enter an IPv6 address.
      </li>
      <li className='mb-1'>
        Enter a Prefix Length (Subnet Mask in IPv4).
      </li>
      <li className='mb-1'>
        Enter Subnet bits (Borrowed bits).
      </li>
      <li>
        Click the Subnet button.
      </li>
    </ul>
  )
}


const AboutOutputContent = () => {
  return (
    <ul className='list-inside list-disc'>
      <li className='mb-1'>
        By default the app will display the first subnet (Subnet zero).
      </li>
      <li className='mb-1'>
        The Subnet label represents the current subnet.
      </li>
      <li className='mb-1'>
      You can find other subnets if available by clicking on the subnet number input next to Subnet label.
      </li>
      <li className='mb-1'>
        The Network(s) label represents the number of subnets.
      </li>
      <li>
        The Hosts label represents the number of hosts per subnet.
      </li>
    </ul>
  )
}


const AboutFeaturesContent = () => {
  return (
    <ul>
      <li className='mb-5'>
        <h4 className='uppercase font-bold text-lg mb-3'>conversions</h4>
        <ul className='ps-4'>
          <li className='mb-3'>
            <h5 className='font-semibold'>Bin to Hex</h5>
            <p>
              This option converts binaries to hexadecimals and vice versa.
            </p>
          </li>
          <li className='mb-3'>
            <h5 className='font-semibold'>Dec to Bin</h5>
            <p>
              This option converts decimals to binaries and vice versa.
            </p>
          </li>
          <li className=''>
            <h5 className='font-semibold'>Hex to Dec</h5>
            <p>
              This option converts hexadecimals to decimals and vice versa.
            </p>
          </li>
        </ul>
      </li>

      <li className='mb-5'>
        <h4 className='uppercase font-bold text-lg mb-3'>Validation</h4>
        <ul className='ps-4'>
          <li className='mb-3'>
            <h5 className='font-semibold'>MAC Address Format</h5>
            <p>
              This option determines if an input MAC address is valid.
            </p>
          </li>
          <li className='mb-3'>
            <h5 className='font-semibold'>IPv6 Address Format</h5>
            <p>
              This option determines if an input IPv6 address is valid.
            </p>
          </li>
          <li className=''>
            <h5 className='font-semibold'>IPv6 Address Type</h5>
            <p>
              This option determines the type of the input IPv6 address.
            </p>
            <p className="mt-1 mb-1">The types are:</p>
            <ul className='list-inside list-disc'>
              <li>Global Unicast Address (Public address)</li>
              <li>Unique Local Unicast Address (Private address)</li>
              <li>Multicast Address</li>
              <li>Link-Local Unicast Address</li>
            </ul>
            
          </li>
        </ul>
      </li>     

      <li className='mb-5'>
        <h4 className='uppercase font-bold text-lg mb-3'>Generator</h4>
        <ul className='ps-4'>
          <li className='mb-3'>
            <h5 className='font-semibold'>Interface ID</h5>
            <p>
              This option generates the Interface ID of IPv6 address using
              the modified Extended Unique Identifier or EUI-64 logic.
            </p>
          </li>
          <li className='mb-3'>
            <h5 className='font-semibold'>Link-Local Address</h5>
            <p>
              This option generates a Unicast Link-Local address using the prefix
              FE80/10 and EUI-64.
            </p>
          </li>
          <li className=''>
            <h5 className='font-semibold'>Solicited-Node Address</h5>
            <p>
              This option generates generates a Solicited-Node Multicast
              Address using the prefix FF02::1:FF/26.
            </p>
          </li>
        </ul>
      </li>

      <li className='mb-5'>
        <h4 className='uppercase font-bold text-lg mb-3'>Utilities</h4>
        <ul className='ps-4'>
          <li className='mb-3'>
            <h5 className='font-semibold'>Expand</h5>
            <p>
              This option expands an abbreviated IPv6 address by adding
              leading zeroes and turning :: into a series of segments of
              all zeroes.
            </p>
          </li>
          <li className='mb-3'>
            <h5 className='font-semibold'>Abbreviate</h5>
            <p>
              This option abbreviates an IPv6 address by removing leading
              zeroes and substitute :: in place of a series of segments of
              all zeroes.
            </p>
          </li>
        </ul>
      </li>            
    </ul>
  )
}

export {
  IntroContent,
  HowToUseContent,
  AboutOutputContent,
  AboutFeaturesContent
}