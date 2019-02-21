> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-mdns-ice-candidates-02) / [summary](../summary/draft-ietf-rtcweb-mdns-ice-candidates-02.md)

---

# Using Multicast DNS to protect privacy when exposing ICE candidates

## 1. Introduction

As detailed in [IPHandling], exposing client private IP addresses by default maximizes the probability of successfully creating direct peer-to-peer connection between two clients, but creates a significant surface for user fingerprinting.  [IPHandling] recognizes this issue, but also admits that there is no current solution to this problem; implementations that choose to use Mode 3 to address the privacy concerns often suffer from failing or suboptimal connections in WebRTC applications.  This is particularly an issue on unmanaged networks, typically homes or small offices, where NAT loopback may not be supported.

This document proposes an overall solution to this problem by registering ephemeral mDNS names for each local private IP address, and then providing those names, rather than the IP addresses, to the web application when it gathers ICE candidates.  WebRTC implementations resolve these names to IP addresses and perform ICE processing as usual, but the actual IP addresses are not exposed to the web application.

## 2. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119].

## 3. Principle

This section uses the concept of ICE agent as defined in [RFC8445]. In the remainder of the document, it is assumed that each browsing context (as defined in Section 7.1 of [HTMLSpec]) has its own ICE agent.

### 3.1. ICE Candidate Gathering

For any host candidate gathered by an ICE agent as part of [RFC8445], Section 5.1.1, the candidate is handled as follows:

1.  Check whether the ICE agent has a usable registered mDNS hostname resolving to the ICE candidate's IP address.  If one exists, skip ahead to Step 6.

2.  Generate a unique mDNS hostname.  The unique name MUST consist of a version 4 UUID as defined in [RFC4122], followed by ".local".

3.  Register the candidate's mDNS hostname as defined in [RFC6762].

4.  If registering of the mDNS hostname fails, abort these steps. The candidate is not exposed.

5.  Store the mDNS hostname and its related IP address in the ICE agent for future reuse.

6.  Replace the IP address of the ICE candidate with its mDNS hostname and provide the candidate to the web application.

An ICE agent can implement this procedure in any way so long as it produces equivalent results to this procedure.

An implementation may for instance pre-register mDNS hostnames by executing steps 3 to 5 and prepopulate an ICE agent accordingly.  By doing so, only step 6 of the above procedure will be executed at the time of gathering candidates.

An implementation may also detect that mDNS is not supported by the available network interfaces.  The ICE agent may skip steps 2 and 3 and directly decide to not expose the host candidate.

This procedure ensures that an mDNS name is used to replace only one IP address.  Specifically, an ICE agent using an interface with both IPv4 and IPv6 addresses MUST expose a different mDNS name for each address.

Any server-reflexive candidates generated from an mDNS local candidate MUST have their raddr field set to 0.0.0.0 and their rport field set to 0.

Any candidates exposed to the web application via local descriptions MUST be identical to those provided during candidate gathering (i.e., MUST NOT contain private host IP addresses).

### 3.2. ICE Candidate Processing

For any remote ICE candidate received by the ICE agent, the following procedure is used:

1.  If the connection-address field value of the ICE candidate does not end with ".local" or if the value contains more than one ".", then process the candidate as defined in [RFC8445].

2.  Otherwise, resolve the candidate using mDNS.

3.  If it resolves to an IP address, replace the mDNS hostname of the ICE candidate with the resolved IP address and continue processing of the candidate.

4.  Otherwise, ignore the candidate.

An ICE agent may use a hostname resolver that transparently supports both Multicast and Unicast DNS.  In this case the resolution of a ".local" name may happen through Unicast DNS as noted in [RFC6762], Section 3.

An ICE agent that supports mDNS candidates MUST support the situation where the hostname resolution results in more than one IP address. In this case, the ICE agent MUST take exactly one of the resolved IP addresses and ignore the others.  The ICE agent SHOULD, if available, use the first IPv6 address resolved, otherwise the first IPv4 address.

## 4. Examples

In this example, mDNS candidates are exchanged between peers and resolved to obtain the corresponding IP addresses.


```
              ICE Agent 1 (1.1.1.1)             ICE Agent 2 (2.2.2.2)
        <Register     |                                 |
         mDNS name N1 |                                 |
         for 1.1.1.1> |                                 |
                      |------- mDNS Candidate N1 ------>|
                      |                                 | <Register
                      |                                 |  mDNS name N2
                      |                                 |  for 2.2.2.2>
                      |<------ mDNS Candidate N2 -------|
       <Resolve       |                                 | <Resolve
        mDNS name N2> |                                 |  mDNS name N1>
                      |<==== STUN check to 1.1.1.1 =====|
                      |===== STUN check to 2.2.2.2 ====>|
                      |                                 |
```

The following two examples indicate how peer-reflexive candidates for host IP addresses can be created due to timing differences.

In this example, a peer-reflexive candidate is generated because the mDNS candidate is signaled after the STUN checks begin.


```
              ICE Agent 1 (1.1.1.1)             ICE Agent 2 (2.2.2.2)
        <Register     |                                 |
         mDNS name N1 |                                 |
         for 1.1.1.1> |                                 |
                      |------- mDNS Candidate N1 ------>|
                      |                                 | <Resolve
                      |                                 |  mDNS name N1>
                      |<==== STUN check to 1.1.1.1 =====|
      prflx candidate |                                 | <Register
      2.2.2.2 created |                                 |  mDNS name N2
                      |                                 |  for 2.2.2.2>
                      |<------ mDNS Candidate N2 -------|
                      |                                 |
```

In this example, a peer-reflexive candidate is generated because the mDNS resolution for name N2 does not complete until after the STUN checks are received.


```
              ICE Agent 1 (1.1.1.1)             ICE Agent 2 (2.2.2.2)
        <Register     |                                 | <Register
         mDNS name N1 |                                 |  mDNS name N2
         for 1.1.1.1> |                                 |  for 2.2.2.2>
                      |------- mDNS Candidate N1 ------>|
                      |<------ mDNS Candidate N2 -------|
<Resolve              |                                 | <Resolve
 ...                  |                                 |  mDNS name N1>
 mDNS                 |<==== STUN check to 1.1.1.1 =====|
 ...  prflx candidate |                                 |
 name 2.2.2.2 created |                                 |
 ...                  |                                 |
 N2>                  |                                 |
```

## 5. Privacy Considerations

The goal of this mechanism is to keep knowledge of private host IP addresses within the ICE agent while continuing to allow the application to transmit ICE candidates.  Besides keeping private host IP addresses out of ICE candidates, implementations must take steps to prevent these IP addresses from being exposed to web applications through other means.

### 5.1. Statistics

Statistics related to ICE candidates that are accessible to the web application MUST NOT contain the IP address of a local or remote mDNS candidate; the mDNS name SHOULD be used instead.

In addition, a peer-reflexive remote candidate may be constructed from a remote host IP address as a result of an ICE connectivity check, as described in Section 7.3.1.3 of [RFC8445].  This check may arrive before the candidate due to signaling or mDNS resolution delays, as shown in the examples above.

To prevent disclosure of the host IP address to the application in this scenario, statistics related to ICE candidates MUST NOT contain the IP address of any peer-reflexive candidate, unless that IP has already been learned through signaling of a candidate with the same address and either the same or a different port; this includes cases where the signaled candidate is discarded as redundant according to Section 5.1.3 of [RFC8445].

### 5.2. Interactions With TURN Servers

When sending data to a TURN [RFC5766] server, the sending client tells the server the destination IP and port for the data.  This means that if the client uses TURN to send to an IP that was obtained by mDNS resolution, the TURN server will learn the underlying host IP and port, and this information can then be relayed to the web application, defeating the value of the mDNS wrapping.

To prevent disclosure of the host IP address to a TURN server, the ICE agent MUST NOT form candidate pairs between its own relay candidates and remote mDNS candidates.  Note that the converse is not an issue; the ICE agent MAY form candidate pairs between its own mDNS candidates and remote relay candidates, as in this situation host IPs will not be sent directly to the TURN server.

This restriction has no effect on connectivity; in the cases where host IP addresses are private and need to be wrapped with mDNS names, they will be unreachable from the TURN server, and as noted above, the reverse path will continue to work normally.

### 5.3. Generated Names Reuse

It is important that use of registered mDNS hostnames is limited in time and/or scope.  Indefinitely reusing the same mDNS hostname candidate would provide applications an even more reliable tracking mechanism than the private IP addresses that this specification is designed to hide.  The use of registered mDNS hostnames SHOULD be scoped by origin, and SHOULD have the lifetime of the page.

### 5.4. Specific Browsing Contexts

As noted in [IPHandling], privacy may be breached if a web application running in two browsing contexts can determine whether it is running on the same device.  While the approach in this document prevents the application from directly comparing local private IP addresses, a successful local WebRTC connection can also present a threat to user privacy.  Specifically, when the latency of a WebRTC connection latency is close to zero, the probability is high that the two peers are running on the same device.

To avoid this issue, browsers SHOULD NOT register mDNS names for WebRTC applications running in a third-party browsing context (i.e., a context that has a different origin than the top-level browsing context), or a private browsing context.

## 6. Security Considerations

### 6.1. mDNS Message Flooding

The implementation of this proposal requires the mDNS querying capability of the browser for registering mDNS names or adding remote ICE host candidates with such names.  It also requires the mDNS responding capability of either the browser or the operating platform of the browser for registering, removing or resolving mDNS names.  In particular,

*  the registration of name requires optional probing queries and mandatory announcing responses ([RFC6762], Section 8), and this is performed at the beginning of ICE gathering;

*  the addition of remote ICE host candidates with mDNS names generates mDNS queries for names of each candidate;

*  the removal of names could happen when the browsing context of the ICE agent is destroyed in an implementation, and goodbye responses should be sent to invalidate records generated by the ICE agent in the local network ([RFC6762], Section 10.1).

A malicious Web application could flood the local network with mDNS messages by:

*  creating browsing contexts that create ICE agents and start gathering of local ICE host candidates;

*  destroying these local candidates soon after the name registration is done;

*  adding fictitious remote ICE host candidates with mDNS names.

[RFC6762] defines a per-record multicast rate limiting rule, in which a given record on a given interface cannot be sent less than one second since its last transmission.  This rate limiting rule however does not mitigate the above attacks, in which new names, hence new records, are constantly created and sent.  A browser-wide mDNS message rate limit MUST be provided for all messages that can be indirectly dispatched by a web application, namely the probing queries, announcement responses, resolution queries, and goodbye responses associated with mDNS.

### 6.2. Malicious Responses to Deny Name Registration

If the optional probing queries are implemented for the name registration, a malicious endpoint in the local network, which is capable of responding mDNS queries, could send responses to block the use of the generated names.  This would lead to the discarding of this ICE host candidate as in Step 5 in Section 3.1.

The above attack can be mitigated by skipping the probing when registering a name, which also conforms to Section 8 in [RFC6762], given that the name is randomly generated for the probabilistic uniqueness (e.g. a version 4 UUID) in Step 3 in Section 3.1. However, a similar attack can be performed by exploiting the negative responses (defined in [RFC6762], Section 8.1), in which NSEC resource records are sent to claim the nonexistence of records related to the gathered ICE host candidates.

The existence of malicious endpoints in the local network poses a generic threat, and requires dedicated protocol suites to mitigate, which is beyond the scope of this proposal.

### 6.3. Monitoring of Sessions

A malicious endpoint in the local network may also record other endpoints who are registering, unregistering, and resolving mDNS names.  By doing so, they can create a session log that shows which endpoints are communicating, and for how long.  If both endpoints in the session are on the same network, the fact they are communicating can be discovered.

As above, mitigation of this threat is beyond the scope of this proposal.

## 7. IANA Considerations

This document requires no actions from IANA.

## 8. Specification Requirements

The proposal relies on identifying and resolving any mDNS-based ICE candidates as part of adding/processing a remote candidate.  [ICESDP] section 4.1 could be updated to explicitly allow mDNS names in the connection-address field.

The proposal relies on adding the ability to register mDNS names at ICE gathering time.  This could be described in [ICESDP] and/or [WebRTCSpec].

The proposal allows updating [IPHandling] so that mode 2 is not the mode used by default when user consent is not required.  Instead, the default mode could be defined as mode 3 with mDNS-based ICE candidates.