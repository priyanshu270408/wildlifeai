# WILDSHIELD AI — User Guide & Hackathon Evaluation Walkthrough

## How to Test the 5 Key Operational Scenarios

Use the top **HACKATHON DEMO SANDBOX** banner on any page to switch personas with one click.

---

### Scenario 1: Citizen Wildlife Sighting & AI Vision Analysis
1. Select **Citizen** persona in the top banner.
2. Click **Report Wildlife Sighting** or navigate to `/citizen/report`.
3. Select **Wildlife Sighting** and choose **Asian Elephant**.
4. In Step 3, enter location or click **Use Device Geolocation**.
5. In Step 4, upload an animal photograph. Watch the **WildShield-Vision-TaxonNet** pipeline analyze optical sharpness, extract features, and return confidence score and uncertainty notes.
6. Complete Steps 5 & 6, and click **Submit Official Report**.
7. Observe the generated Incident ID and status marked as `SUBMITTED`.

---

### Scenario 2: Forest Officer Incident Verification
1. Switch to **Forest Officer** persona in the top banner.
2. Navigate to **Incident Queue** or `/officer/dashboard`.
3. In the Operational Verification Queue, locate the pending incident.
4. Click **Verify & Alert**.
5. Add field patrol notes, check **Publish Public Community Safety Advisory**, and click **Confirm Verification**.
6. The incident status updates to `VERIFIED`, and an official advisory is automatically dispatched to the community.

---

### Scenario 3: Explainable Conflict Risk Assessment
1. Navigate to **Intelligence Map** (`/map`).
2. Examine the 8km dashed circular overlays representing monitored buffer zones.
3. Click on the **Corbett Foothills** or **Valparai** risk zone.
4. Inspect the **Contributing Factors** popup: observe the time-decayed sighting frequency, crop harvesting overlap notes, and recommended ranger patrol actions.

---

### Scenario 4: Citizen Community Notification Center
1. Switch back to **Citizen** or **Farmer** persona in the top banner.
2. Click the **Notification Bell** in the top right navbar.
3. Observe the newly issued advisory with timestamp and issuing officer attribution.
4. Navigate to `/citizen/dashboard` to see your verified incident in the report timeline.

---

### Scenario 5: Rapid Response Team Dispatch & Resolution
1. Switch to **Forest Officer** persona.
2. In the incident queue, click **Dispatch Team** on a verified incident.
3. Select **Corbett Rapid Conflict Response Team (RCRT-1)**, set priority to `High`, and enter instructions. Click **Dispatch Unit**.
4. Switch to **Response Team** persona in the top banner.
5. In the field operations view (`/response/dashboard`), accept the assignment, update the tactical status to `On-Site Perimeter Secured`, and submit resolution notes.
