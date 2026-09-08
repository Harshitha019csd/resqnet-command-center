# ResQNet Command Center

Design a complete mobile/tablet application UI/UX for ResQNet – an off-grid emergency communication and rescue coordination platform.

Create the RESCUER / EMERGENCY RESPONSE SIDE ONLY.

The rescuer interface is used by:

disaster-response teams

search-and-rescue personnel

firefighters

emergency medical teams

trained volunteers

field coordinators

The rescuer should be able to discover emergency alerts, communicate with affected people, understand their location, monitor the off-grid network, and coordinate rescue operations.

Core Concept

ResQNet creates an emergency communication layer that can operate when conventional cellular networks or internet connectivity are unavailable.

The rescuer application receives emergency requests through the ResQNet off-grid network.

The system should provide:

Emergency Detection → Location → Communication → Network Awareness → Rescue Coordination → Resolution

Design Style

Use a professional emergency-response command interface.

Visual characteristics:

dark professional interface

high contrast

map-centric design

red for critical emergencies

orange for active response

green for resolved/safe

yellow for warnings

clear status indicators

compact but readable information

minimal decorative elements

The interface should feel like a combination of:

emergency dispatch system

search-and-rescue map

field communication device

disaster-response dashboard

1. Rescuer Login / Authentication

Create:

Rescuer login

Team/organization selection

Rescuer ID

secure authentication

availability status

After login, show:

ONLINE / OFFLINE / FIELD MODE

The application must continue providing useful functionality when internet connectivity is unavailable.

2. Rescuer Command Dashboard

The main dashboard should immediately show:

ACTIVE EMERGENCIES

Display emergency cards containing:

emergency type

priority

approximate/current location

number of people affected

time received

distance from rescuer

communication status

last update

Use priority levels:

CRITICAL
HIGH
MEDIUM
LOW

Critical emergencies should be immediately visually identifiable.

3. Live Emergency Map

Create the main map interface.

Display:

SOS locations

affected users

rescuers

ResQNet relay nodes

gateways

communication links

last known locations

rescue team locations

Use different map markers for:

Person in danger

Rescuer

Relay node

Gateway

Safe location

Completed rescue

Allow rescuers to select an emergency marker and open its details.

4. Emergency Detail Screen

When a rescuer selects an SOS, show:

EMERGENCY #XXXX

Information:

emergency type

priority

number of people

user name/ID

medical information

last known location

GPS accuracy

timestamp

battery level

communication status

last received message

Provide primary actions:

ACKNOWLEDGE
CONTACT PERSON
ASSIGN RESCUER
NAVIGATE
UPDATE STATUS

5. Two-Way Emergency Communication

Create a dedicated communication screen between rescuer and affected user.

Show:

received messages

sent messages

delivery status

last communication time

network route/status

Include quick-response buttons:

"We received your SOS."

"Help is on the way."

"Stay where you are."

"Are you injured?"

"Can you move?"

"Send your location."

"Conserve battery."

The interface should communicate that messages may travel through multiple off-grid relay nodes.

6. Network / Mesh Monitoring

This is an important ResQNet differentiator.

Create a network visualization showing:

User → Relay Node → Relay Node → Gateway/Rescuer

Display:

active nodes

inactive nodes

connected rescuers

network coverage

message route

last-seen time

link quality

node battery

network gaps

Allow rescuers to identify areas where communication coverage is weak.

7. Rescue Assignment

Create a rescue assignment interface.

A coordinator should be able to:

assign emergency to a rescuer/team

see available rescuers

view distance

view estimated travel time

assign priority

track assignment status

Statuses:

Unassigned → Assigned → En Route → On Scene → Rescue In Progress → Resolved

8. Rescuer Navigation

When a rescuer accepts an emergency:

Show:

victim location

rescuer location

route

distance

estimated arrival

last known GPS position

location accuracy

If internet maps are unavailable, provide a simplified offline navigation concept based on available stored map/location data.

9. People / Victim Information

Create a profile view containing:

user identity

emergency information

medical information

number of people

last communication

location history

emergency history

Medical information must be highly visible during a critical emergency.

10. Emergency Status Updates

Allow rescuers to update:

SOS RECEIVED
↓
ACKNOWLEDGED
↓
RESCUER ASSIGNED
↓
EN ROUTE
↓
ON SCENE
↓
RESCUE IN PROGRESS
↓
RESOLVED

Every status update should include timestamp and rescuer identity.

11. Incident History

Create an incident-management screen containing:

active incidents

resolved incidents

incident timeline

communication history

rescue response time

location

assigned team

outcome

Allow filtering by:

priority

emergency type

status

location

time

12. Rescuer Profile / Settings

Include:

rescuer identity

organization/team

role

availability

device status

battery

GPS

network status

notification settings

Critical UX Requirements

The rescuer application must clearly communicate the difference between:

Internet connectivity
Cellular connectivity
GPS availability
ResQNet off-grid connectivity

Do not assume internet access.

The application should remain useful during disasters where conventional infrastructure has failed.

ResQNet Differentiation

Make the following concept visually prominent:

"When conventional communication fails, ResQNet keeps the rescue network connected."

The rescuer should be able to understand:

where victims are

who needs help first

whether communication is possible

how the SOS reached them

which relay nodes are active

which rescuer is responding

whether the victim is still communicating

whether the rescue has been completed

Required Screens

Create a connected high-fidelity prototype containing:

Rescuer Login

Rescuer Dashboard

Active Emergency List

Live Emergency Map

Emergency Detail

Two-Way Communication

Network/Mesh Monitoring

Rescue Assignment

Rescuer Navigation

Victim Information

Incident Status Timeline

Incident History

Rescuer Profile / Settings

The final interface should look like a professional disaster-response and search-and-rescue system, not a generic messaging application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/70aff64f-5117-4a2f-9111-8694ce335422).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
