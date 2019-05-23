> Read [original](https://tools.ietf.org/html/draft-thatcher-ice-renomination-01) / [summary](../summary/draft-thatcher-ice-renomination-01.md)

---

# ICE Renomination: Dynamically selecting ICE candidate pairs

## 1. Introduction

ICE agents are either controlling or controlled.  The controlling ICE agent can unilaterally select a given candidate pair at any time. But it cannot control what candidate pair the controlled ICE agent selects once the controlling ICE agent has nominated a candidate pair (with passive nomination) or nominated many candidate pairs (with aggressive nomination), with the exception that it may nominate a higher priority candidate pair with aggressive nomination.  This greatly limits the controlling side's options.

For example, if an ICE agent selects and nominates a candidate pair over a cellular network, and then later connects to a Wi-Fi network and trickles ICE candidates for the Wi-Fi network, it may wish to select and nominate a candidate pair using Wi-Fi.  If soon thereafter the Wi-Fi network disconnects and the ICE agent wishes to select and nominate the cellular candidate pair again, it would be unable to do with either passive or aggressive nomination.

## 2. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119].

## 3. Renomination

We define a new ICE option called "renomination".  When renomination is signaled, aggressive nomination is disabled, and the controlled side follows a rule of "last nomination wins".  This allows the controlling side to send nominations for new candidate pairs at any time.  The controlling side SHOULD send the new nomination until the STUN packet is acked to ensure that the renomination was received.

If one side signals "renomination" and the other does not understand it, then according to the rules of ICE, aggressive nomination is disabled and passive nomination is used, and the controlling side MUST NOT send more than one nomination.

## 4. "Nomination" attribute

To deal with out-of-order delivery of nominations, we define a new STUN attribute: "nomination" which includes a 24-bit integer in the 3 least significant bytes of the attribute.

The controlling side MAY include such an attribute when renominating. The controlled side MUST select the nomination with the largest value contained in the "nomination" attribute.  Any value included takes precedence over the lack of a value.

## 5. IANA Considerations

This specification requests no actions from IANA.

## 6. Security Considerations

TODO
