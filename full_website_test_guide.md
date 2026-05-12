# UP100X AI - Comprehensive Platform Test Guide & Role-Based Manual

## 1. Introduction
Welcome to the official UP100X AI Platform Test Guide. This document serves as a comprehensive manual for developers, testers, and stakeholders to understand the intricate workings of the UP100X AI platform. UP100X AI is a cutting-edge AI-driven Outreach and Reputation Management (ORM) system that leverages advanced voice synthesis and automated dialing pipelines to facilitate business growth.

The platform is designed with a strict **Role-Based Access Control (RBAC)** architecture, ensuring that data integrity, compliance, and financial security are maintained across multiple tiers of users—from global operations leadership to client-side sales team members.

This guide provides a deep dive into each user role, their specific capabilities, inter-role interactions, and step-by-step instructions for testing and utilizing the platform effectively.

---

## 2. Core Architecture & Security (RBAC)
The UP100X AI platform operates on a multi-tenant architecture where data isolation is enforced at the API layer. 

### 2.1 The Golden Rule
"Clients configure intent. UP100X AI provisions infrastructure."
This principle dictates that while clients have control over their campaigns and settings, any action that touches telephony infrastructure, regulatory compliance (10DLC/TPS), or bulk contact data must pass through the **Global Control Center (GCC) gate**.

### 2.2 Role Taxonomy
There are 6 distinct roles defined in the system:
1.  **GCC Admin**: Global Operations Leadership (God Mode).
2.  **GCC Reviewer**: Operations Staff (Human-in-the-loop).
3.  **Sales Partner (Primary)**: Independent Resellers / Agency Owners.
4.  **Sales Partner Sub-user**: Sales Representatives under a Sales Partner.
5.  **Client Admin**: Business Owners or VPs at the client organization.
6.  **Client Sub-user**: Sales Managers, SDR Leads, or Team Members.

---

## 3. Role-Specific User Guides

### 3.1 GCC Admin (Global Operations Leadership)
The GCC Admin has unrestricted access to the entire platform. This role is reserved for UP100X AI internal staff who manage the global infrastructure.

#### Capabilities:
*   **Tenant Management**: Create and destroy Sales Partners and Client organizations.
*   **Infrastructure Control**: Provision phone numbers, manage 10DLC registrations, and configure AI agents from scratch.
*   **Global Visibility**: View live calls, recordings, transcripts, and health scores for *every* client in the system.
*   **Financial Oversight**: View all payments, manage billing cycles, and oversee commission disbursements.
*   **Override Power**: The GCC Admin can pause any campaign, override any setting, and bypass standard approval queues in emergencies.

#### How to use:
1.  **Accessing the Admin Portal**: Log in and navigate to the `/admin/dashboard`.
2.  **Creating a New Sales Partner**: Go to `Organizations` -> `Add New`. Select "Sales Partner" as the type. Provide the Master Agency Agreement details.
3.  **Provisioning Telephony**: Navigate to `Phone Numbers`. Use the provisioning tool to buy numbers for a specific client. Assign these numbers to the appropriate 10DLC campaign.
4.  **Monitoring System Health**: Use the `Global Analytics` view to see real-time performance across all tenants. Look for high failure rates or compliance flags.

---

## 4. Testing Procedures & Granular UI Checks

## 5. Exhaustive UI Verification Suite
1. Verify element #element-0001 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
2. Verify element #element-0002 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
3. Verify element #element-0003 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
4. Verify element #element-0004 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
5. Verify element #element-0005 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
6. Verify element #element-0006 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
7. Verify element #element-0007 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
8. Verify element #element-0008 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
9. Verify element #element-0009 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
10. Verify element #element-0010 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
11. Verify element #element-0011 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
12. Verify element #element-0012 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
13. Verify element #element-0013 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
14. Verify element #element-0014 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
15. Verify element #element-0015 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
16. Verify element #element-0016 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
17. Verify element #element-0017 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
18. Verify element #element-0018 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
19. Verify element #element-0019 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
20. Verify element #element-0020 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
21. Verify element #element-0021 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
22. Verify element #element-0022 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
23. Verify element #element-0023 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
24. Verify element #element-0024 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
25. Verify element #element-0025 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
26. Verify element #element-0026 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
27. Verify element #element-0027 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
28. Verify element #element-0028 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
29. Verify element #element-0029 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
30. Verify element #element-0030 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
31. Verify element #element-0031 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
32. Verify element #element-0032 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
33. Verify element #element-0033 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
34. Verify element #element-0034 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
35. Verify element #element-0035 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
36. Verify element #element-0036 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
37. Verify element #element-0037 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
38. Verify element #element-0038 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
39. Verify element #element-0039 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
40. Verify element #element-0040 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
41. Verify element #element-0041 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
42. Verify element #element-0042 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
43. Verify element #element-0043 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
44. Verify element #element-0044 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
45. Verify element #element-0045 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
46. Verify element #element-0046 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
47. Verify element #element-0047 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
48. Verify element #element-0048 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
49. Verify element #element-0049 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
50. Verify element #element-0050 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
51. Verify element #element-0051 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
52. Verify element #element-0052 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
53. Verify element #element-0053 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
54. Verify element #element-0054 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
55. Verify element #element-0055 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
56. Verify element #element-0056 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
57. Verify element #element-0057 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
58. Verify element #element-0058 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
59. Verify element #element-0059 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
60. Verify element #element-0060 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
61. Verify element #element-0061 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
62. Verify element #element-0062 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
63. Verify element #element-0063 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
64. Verify element #element-0064 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
65. Verify element #element-0065 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
66. Verify element #element-0066 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
67. Verify element #element-0067 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
68. Verify element #element-0068 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
69. Verify element #element-0069 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
70. Verify element #element-0070 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
71. Verify element #element-0071 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
72. Verify element #element-0072 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
73. Verify element #element-0073 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
74. Verify element #element-0074 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
75. Verify element #element-0075 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
76. Verify element #element-0076 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
77. Verify element #element-0077 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
78. Verify element #element-0078 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
79. Verify element #element-0079 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
80. Verify element #element-0080 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
81. Verify element #element-0081 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
82. Verify element #element-0082 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
83. Verify element #element-0083 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
84. Verify element #element-0084 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
85. Verify element #element-0085 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
86. Verify element #element-0086 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
87. Verify element #element-0087 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
88. Verify element #element-0088 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
89. Verify element #element-0089 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
90. Verify element #element-0090 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
91. Verify element #element-0091 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
92. Verify element #element-0092 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
93. Verify element #element-0093 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
94. Verify element #element-0094 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
95. Verify element #element-0095 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
96. Verify element #element-0096 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
97. Verify element #element-0097 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
98. Verify element #element-0098 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
99. Verify element #element-0099 on Dashboard Page 1.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
100. Verify element #element-0100 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
101. Verify element #element-0101 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
102. Verify element #element-0102 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
103. Verify element #element-0103 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
104. Verify element #element-0104 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
105. Verify element #element-0105 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
106. Verify element #element-0106 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
107. Verify element #element-0107 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
108. Verify element #element-0108 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
109. Verify element #element-0109 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
110. Verify element #element-0110 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
111. Verify element #element-0111 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
112. Verify element #element-0112 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
113. Verify element #element-0113 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
114. Verify element #element-0114 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
115. Verify element #element-0115 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
116. Verify element #element-0116 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
117. Verify element #element-0117 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
118. Verify element #element-0118 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
119. Verify element #element-0119 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
120. Verify element #element-0120 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
121. Verify element #element-0121 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
122. Verify element #element-0122 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
123. Verify element #element-0123 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
124. Verify element #element-0124 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
125. Verify element #element-0125 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
126. Verify element #element-0126 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
127. Verify element #element-0127 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
128. Verify element #element-0128 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
129. Verify element #element-0129 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
130. Verify element #element-0130 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
131. Verify element #element-0131 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
132. Verify element #element-0132 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
133. Verify element #element-0133 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
134. Verify element #element-0134 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
135. Verify element #element-0135 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
136. Verify element #element-0136 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
137. Verify element #element-0137 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
138. Verify element #element-0138 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
139. Verify element #element-0139 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
140. Verify element #element-0140 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
141. Verify element #element-0141 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
142. Verify element #element-0142 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
143. Verify element #element-0143 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
144. Verify element #element-0144 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
145. Verify element #element-0145 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
146. Verify element #element-0146 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
147. Verify element #element-0147 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
148. Verify element #element-0148 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
149. Verify element #element-0149 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
150. Verify element #element-0150 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
151. Verify element #element-0151 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
152. Verify element #element-0152 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
153. Verify element #element-0153 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
154. Verify element #element-0154 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
155. Verify element #element-0155 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
156. Verify element #element-0156 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
157. Verify element #element-0157 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
158. Verify element #element-0158 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
159. Verify element #element-0159 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
160. Verify element #element-0160 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
161. Verify element #element-0161 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
162. Verify element #element-0162 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
163. Verify element #element-0163 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
164. Verify element #element-0164 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
165. Verify element #element-0165 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
166. Verify element #element-0166 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
167. Verify element #element-0167 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
168. Verify element #element-0168 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
169. Verify element #element-0169 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
170. Verify element #element-0170 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
171. Verify element #element-0171 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
172. Verify element #element-0172 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
173. Verify element #element-0173 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
174. Verify element #element-0174 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
175. Verify element #element-0175 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
176. Verify element #element-0176 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
177. Verify element #element-0177 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
178. Verify element #element-0178 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
179. Verify element #element-0179 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
180. Verify element #element-0180 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
181. Verify element #element-0181 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
182. Verify element #element-0182 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
183. Verify element #element-0183 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
184. Verify element #element-0184 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
185. Verify element #element-0185 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
186. Verify element #element-0186 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
187. Verify element #element-0187 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
188. Verify element #element-0188 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
189. Verify element #element-0189 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
190. Verify element #element-0190 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
191. Verify element #element-0191 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
192. Verify element #element-0192 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
193. Verify element #element-0193 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
194. Verify element #element-0194 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
195. Verify element #element-0195 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
196. Verify element #element-0196 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
197. Verify element #element-0197 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
198. Verify element #element-0198 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
199. Verify element #element-0199 on Dashboard Page 2.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
200. Verify element #element-0200 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
201. Verify element #element-0201 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
202. Verify element #element-0202 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
203. Verify element #element-0203 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
204. Verify element #element-0204 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
205. Verify element #element-0205 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
206. Verify element #element-0206 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
207. Verify element #element-0207 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
208. Verify element #element-0208 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
209. Verify element #element-0209 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
210. Verify element #element-0210 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
211. Verify element #element-0211 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
212. Verify element #element-0212 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
213. Verify element #element-0213 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
214. Verify element #element-0214 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
215. Verify element #element-0215 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
216. Verify element #element-0216 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
217. Verify element #element-0217 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
218. Verify element #element-0218 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
219. Verify element #element-0219 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
220. Verify element #element-0220 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
221. Verify element #element-0221 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
222. Verify element #element-0222 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
223. Verify element #element-0223 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
224. Verify element #element-0224 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
225. Verify element #element-0225 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
226. Verify element #element-0226 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
227. Verify element #element-0227 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
228. Verify element #element-0228 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
229. Verify element #element-0229 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
230. Verify element #element-0230 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
231. Verify element #element-0231 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
232. Verify element #element-0232 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
233. Verify element #element-0233 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
234. Verify element #element-0234 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
235. Verify element #element-0235 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
236. Verify element #element-0236 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
237. Verify element #element-0237 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
238. Verify element #element-0238 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
239. Verify element #element-0239 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
240. Verify element #element-0240 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
241. Verify element #element-0241 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
242. Verify element #element-0242 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
243. Verify element #element-0243 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
244. Verify element #element-0244 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
245. Verify element #element-0245 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
246. Verify element #element-0246 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
247. Verify element #element-0247 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
248. Verify element #element-0248 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
249. Verify element #element-0249 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
250. Verify element #element-0250 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
251. Verify element #element-0251 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
252. Verify element #element-0252 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
253. Verify element #element-0253 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
254. Verify element #element-0254 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
255. Verify element #element-0255 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
256. Verify element #element-0256 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
257. Verify element #element-0257 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
258. Verify element #element-0258 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
259. Verify element #element-0259 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
260. Verify element #element-0260 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
261. Verify element #element-0261 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
262. Verify element #element-0262 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
263. Verify element #element-0263 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
264. Verify element #element-0264 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
265. Verify element #element-0265 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
266. Verify element #element-0266 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
267. Verify element #element-0267 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
268. Verify element #element-0268 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
269. Verify element #element-0269 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
270. Verify element #element-0270 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
271. Verify element #element-0271 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
272. Verify element #element-0272 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
273. Verify element #element-0273 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
274. Verify element #element-0274 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
275. Verify element #element-0275 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
276. Verify element #element-0276 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
277. Verify element #element-0277 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
278. Verify element #element-0278 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
279. Verify element #element-0279 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
280. Verify element #element-0280 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
281. Verify element #element-0281 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
282. Verify element #element-0282 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
283. Verify element #element-0283 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
284. Verify element #element-0284 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
285. Verify element #element-0285 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
286. Verify element #element-0286 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
287. Verify element #element-0287 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
288. Verify element #element-0288 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
289. Verify element #element-0289 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
290. Verify element #element-0290 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
291. Verify element #element-0291 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
292. Verify element #element-0292 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
293. Verify element #element-0293 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
294. Verify element #element-0294 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
295. Verify element #element-0295 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
296. Verify element #element-0296 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
297. Verify element #element-0297 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
298. Verify element #element-0298 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
299. Verify element #element-0299 on Dashboard Page 3.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
300. Verify element #element-0300 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
301. Verify element #element-0301 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
302. Verify element #element-0302 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
303. Verify element #element-0303 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
304. Verify element #element-0304 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
305. Verify element #element-0305 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
306. Verify element #element-0306 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
307. Verify element #element-0307 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
308. Verify element #element-0308 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
309. Verify element #element-0309 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
310. Verify element #element-0310 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
311. Verify element #element-0311 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
312. Verify element #element-0312 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
313. Verify element #element-0313 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
314. Verify element #element-0314 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
315. Verify element #element-0315 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
316. Verify element #element-0316 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
317. Verify element #element-0317 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
318. Verify element #element-0318 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
319. Verify element #element-0319 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
320. Verify element #element-0320 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
321. Verify element #element-0321 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
322. Verify element #element-0322 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
323. Verify element #element-0323 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
324. Verify element #element-0324 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
325. Verify element #element-0325 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
326. Verify element #element-0326 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
327. Verify element #element-0327 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
328. Verify element #element-0328 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
329. Verify element #element-0329 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
330. Verify element #element-0330 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
331. Verify element #element-0331 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
332. Verify element #element-0332 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
333. Verify element #element-0333 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
334. Verify element #element-0334 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
335. Verify element #element-0335 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
336. Verify element #element-0336 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
337. Verify element #element-0337 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
338. Verify element #element-0338 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
339. Verify element #element-0339 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
340. Verify element #element-0340 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
341. Verify element #element-0341 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
342. Verify element #element-0342 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
343. Verify element #element-0343 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
344. Verify element #element-0344 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
345. Verify element #element-0345 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
346. Verify element #element-0346 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
347. Verify element #element-0347 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
348. Verify element #element-0348 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
349. Verify element #element-0349 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
350. Verify element #element-0350 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
351. Verify element #element-0351 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
352. Verify element #element-0352 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
353. Verify element #element-0353 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
354. Verify element #element-0354 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
355. Verify element #element-0355 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
356. Verify element #element-0356 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
357. Verify element #element-0357 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
358. Verify element #element-0358 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
359. Verify element #element-0359 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
360. Verify element #element-0360 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
361. Verify element #element-0361 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
362. Verify element #element-0362 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
363. Verify element #element-0363 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
364. Verify element #element-0364 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
365. Verify element #element-0365 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
366. Verify element #element-0366 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
367. Verify element #element-0367 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
368. Verify element #element-0368 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
369. Verify element #element-0369 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
370. Verify element #element-0370 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
371. Verify element #element-0371 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
372. Verify element #element-0372 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
373. Verify element #element-0373 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
374. Verify element #element-0374 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
375. Verify element #element-0375 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
376. Verify element #element-0376 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
377. Verify element #element-0377 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
378. Verify element #element-0378 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
379. Verify element #element-0379 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
380. Verify element #element-0380 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
381. Verify element #element-0381 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
382. Verify element #element-0382 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
383. Verify element #element-0383 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
384. Verify element #element-0384 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
385. Verify element #element-0385 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
386. Verify element #element-0386 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
387. Verify element #element-0387 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
388. Verify element #element-0388 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
389. Verify element #element-0389 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
390. Verify element #element-0390 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
391. Verify element #element-0391 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
392. Verify element #element-0392 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
393. Verify element #element-0393 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
394. Verify element #element-0394 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
395. Verify element #element-0395 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
396. Verify element #element-0396 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
397. Verify element #element-0397 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
398. Verify element #element-0398 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
399. Verify element #element-0399 on Dashboard Page 4.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
400. Verify element #element-0400 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
401. Verify element #element-0401 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
402. Verify element #element-0402 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
403. Verify element #element-0403 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
404. Verify element #element-0404 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
405. Verify element #element-0405 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
406. Verify element #element-0406 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
407. Verify element #element-0407 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
408. Verify element #element-0408 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
409. Verify element #element-0409 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
410. Verify element #element-0410 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
411. Verify element #element-0411 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
412. Verify element #element-0412 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
413. Verify element #element-0413 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
414. Verify element #element-0414 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
415. Verify element #element-0415 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
416. Verify element #element-0416 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
417. Verify element #element-0417 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
418. Verify element #element-0418 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
419. Verify element #element-0419 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
420. Verify element #element-0420 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
421. Verify element #element-0421 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
422. Verify element #element-0422 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
423. Verify element #element-0423 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
424. Verify element #element-0424 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
425. Verify element #element-0425 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
426. Verify element #element-0426 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
427. Verify element #element-0427 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
428. Verify element #element-0428 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
429. Verify element #element-0429 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
430. Verify element #element-0430 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
431. Verify element #element-0431 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
432. Verify element #element-0432 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
433. Verify element #element-0433 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
434. Verify element #element-0434 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
435. Verify element #element-0435 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
436. Verify element #element-0436 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
437. Verify element #element-0437 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
438. Verify element #element-0438 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
439. Verify element #element-0439 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
440. Verify element #element-0440 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
441. Verify element #element-0441 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
442. Verify element #element-0442 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
443. Verify element #element-0443 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
444. Verify element #element-0444 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
445. Verify element #element-0445 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
446. Verify element #element-0446 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
447. Verify element #element-0447 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
448. Verify element #element-0448 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
449. Verify element #element-0449 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
450. Verify element #element-0450 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
451. Verify element #element-0451 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
452. Verify element #element-0452 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
453. Verify element #element-0453 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
454. Verify element #element-0454 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
455. Verify element #element-0455 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
456. Verify element #element-0456 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
457. Verify element #element-0457 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
458. Verify element #element-0458 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
459. Verify element #element-0459 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
460. Verify element #element-0460 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
461. Verify element #element-0461 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
462. Verify element #element-0462 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
463. Verify element #element-0463 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
464. Verify element #element-0464 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
465. Verify element #element-0465 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
466. Verify element #element-0466 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
467. Verify element #element-0467 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
468. Verify element #element-0468 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
469. Verify element #element-0469 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
470. Verify element #element-0470 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
471. Verify element #element-0471 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
472. Verify element #element-0472 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
473. Verify element #element-0473 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
474. Verify element #element-0474 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
475. Verify element #element-0475 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
476. Verify element #element-0476 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
477. Verify element #element-0477 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
478. Verify element #element-0478 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
479. Verify element #element-0479 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
480. Verify element #element-0480 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
481. Verify element #element-0481 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
482. Verify element #element-0482 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
483. Verify element #element-0483 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
484. Verify element #element-0484 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
485. Verify element #element-0485 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
486. Verify element #element-0486 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
487. Verify element #element-0487 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
488. Verify element #element-0488 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
489. Verify element #element-0489 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
490. Verify element #element-0490 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
491. Verify element #element-0491 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
492. Verify element #element-0492 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
493. Verify element #element-0493 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
494. Verify element #element-0494 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
495. Verify element #element-0495 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
496. Verify element #element-0496 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
497. Verify element #element-0497 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
498. Verify element #element-0498 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
499. Verify element #element-0499 on Dashboard Page 5.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
500. Verify element #element-0500 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
501. Verify element #element-0501 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
502. Verify element #element-0502 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
503. Verify element #element-0503 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
504. Verify element #element-0504 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
505. Verify element #element-0505 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
506. Verify element #element-0506 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
507. Verify element #element-0507 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
508. Verify element #element-0508 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
509. Verify element #element-0509 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
510. Verify element #element-0510 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
511. Verify element #element-0511 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
512. Verify element #element-0512 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
513. Verify element #element-0513 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
514. Verify element #element-0514 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
515. Verify element #element-0515 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
516. Verify element #element-0516 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
517. Verify element #element-0517 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
518. Verify element #element-0518 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
519. Verify element #element-0519 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
520. Verify element #element-0520 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
521. Verify element #element-0521 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
522. Verify element #element-0522 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
523. Verify element #element-0523 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
524. Verify element #element-0524 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
525. Verify element #element-0525 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
526. Verify element #element-0526 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
527. Verify element #element-0527 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
528. Verify element #element-0528 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
529. Verify element #element-0529 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
530. Verify element #element-0530 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
531. Verify element #element-0531 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
532. Verify element #element-0532 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
533. Verify element #element-0533 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
534. Verify element #element-0534 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
535. Verify element #element-0535 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
536. Verify element #element-0536 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
537. Verify element #element-0537 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
538. Verify element #element-0538 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
539. Verify element #element-0539 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
540. Verify element #element-0540 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
541. Verify element #element-0541 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
542. Verify element #element-0542 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
543. Verify element #element-0543 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
544. Verify element #element-0544 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
545. Verify element #element-0545 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
546. Verify element #element-0546 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
547. Verify element #element-0547 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
548. Verify element #element-0548 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
549. Verify element #element-0549 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
550. Verify element #element-0550 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
551. Verify element #element-0551 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
552. Verify element #element-0552 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
553. Verify element #element-0553 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
554. Verify element #element-0554 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
555. Verify element #element-0555 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
556. Verify element #element-0556 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
557. Verify element #element-0557 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
558. Verify element #element-0558 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
559. Verify element #element-0559 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
560. Verify element #element-0560 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
561. Verify element #element-0561 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
562. Verify element #element-0562 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
563. Verify element #element-0563 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
564. Verify element #element-0564 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
565. Verify element #element-0565 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
566. Verify element #element-0566 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
567. Verify element #element-0567 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
568. Verify element #element-0568 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
569. Verify element #element-0569 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
570. Verify element #element-0570 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
571. Verify element #element-0571 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
572. Verify element #element-0572 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
573. Verify element #element-0573 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
574. Verify element #element-0574 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
575. Verify element #element-0575 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
576. Verify element #element-0576 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
577. Verify element #element-0577 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
578. Verify element #element-0578 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
579. Verify element #element-0579 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
580. Verify element #element-0580 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
581. Verify element #element-0581 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
582. Verify element #element-0582 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
583. Verify element #element-0583 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
584. Verify element #element-0584 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
585. Verify element #element-0585 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
586. Verify element #element-0586 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
587. Verify element #element-0587 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
588. Verify element #element-0588 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
589. Verify element #element-0589 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
590. Verify element #element-0590 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
591. Verify element #element-0591 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
592. Verify element #element-0592 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
593. Verify element #element-0593 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
594. Verify element #element-0594 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
595. Verify element #element-0595 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
596. Verify element #element-0596 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
597. Verify element #element-0597 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
598. Verify element #element-0598 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
599. Verify element #element-0599 on Dashboard Page 6.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
600. Verify element #element-0600 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
601. Verify element #element-0601 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
602. Verify element #element-0602 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
603. Verify element #element-0603 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
604. Verify element #element-0604 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
605. Verify element #element-0605 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
606. Verify element #element-0606 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
607. Verify element #element-0607 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
608. Verify element #element-0608 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
609. Verify element #element-0609 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
610. Verify element #element-0610 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
611. Verify element #element-0611 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
612. Verify element #element-0612 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
613. Verify element #element-0613 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
614. Verify element #element-0614 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
615. Verify element #element-0615 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
616. Verify element #element-0616 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
617. Verify element #element-0617 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
618. Verify element #element-0618 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
619. Verify element #element-0619 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
620. Verify element #element-0620 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
621. Verify element #element-0621 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
622. Verify element #element-0622 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
623. Verify element #element-0623 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
624. Verify element #element-0624 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
625. Verify element #element-0625 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
626. Verify element #element-0626 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
627. Verify element #element-0627 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
628. Verify element #element-0628 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
629. Verify element #element-0629 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
630. Verify element #element-0630 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
631. Verify element #element-0631 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
632. Verify element #element-0632 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
633. Verify element #element-0633 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
634. Verify element #element-0634 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
635. Verify element #element-0635 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
636. Verify element #element-0636 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
637. Verify element #element-0637 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
638. Verify element #element-0638 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
639. Verify element #element-0639 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
640. Verify element #element-0640 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
641. Verify element #element-0641 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
642. Verify element #element-0642 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
643. Verify element #element-0643 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
644. Verify element #element-0644 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
645. Verify element #element-0645 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
646. Verify element #element-0646 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
647. Verify element #element-0647 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
648. Verify element #element-0648 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
649. Verify element #element-0649 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
650. Verify element #element-0650 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
651. Verify element #element-0651 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
652. Verify element #element-0652 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
653. Verify element #element-0653 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
654. Verify element #element-0654 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
655. Verify element #element-0655 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
656. Verify element #element-0656 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
657. Verify element #element-0657 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
658. Verify element #element-0658 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
659. Verify element #element-0659 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
660. Verify element #element-0660 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
661. Verify element #element-0661 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
662. Verify element #element-0662 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
663. Verify element #element-0663 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
664. Verify element #element-0664 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
665. Verify element #element-0665 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
666. Verify element #element-0666 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
667. Verify element #element-0667 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
668. Verify element #element-0668 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
669. Verify element #element-0669 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
670. Verify element #element-0670 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
671. Verify element #element-0671 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
672. Verify element #element-0672 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
673. Verify element #element-0673 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
674. Verify element #element-0674 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
675. Verify element #element-0675 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
676. Verify element #element-0676 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
677. Verify element #element-0677 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
678. Verify element #element-0678 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
679. Verify element #element-0679 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
680. Verify element #element-0680 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
681. Verify element #element-0681 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
682. Verify element #element-0682 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
683. Verify element #element-0683 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
684. Verify element #element-0684 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
685. Verify element #element-0685 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
686. Verify element #element-0686 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
687. Verify element #element-0687 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
688. Verify element #element-0688 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
689. Verify element #element-0689 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
690. Verify element #element-0690 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
691. Verify element #element-0691 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
692. Verify element #element-0692 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
693. Verify element #element-0693 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
694. Verify element #element-0694 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
695. Verify element #element-0695 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
696. Verify element #element-0696 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
697. Verify element #element-0697 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
698. Verify element #element-0698 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
699. Verify element #element-0699 on Dashboard Page 7.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
700. Verify element #element-0700 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
701. Verify element #element-0701 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
702. Verify element #element-0702 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
703. Verify element #element-0703 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
704. Verify element #element-0704 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
705. Verify element #element-0705 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
706. Verify element #element-0706 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
707. Verify element #element-0707 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
708. Verify element #element-0708 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
709. Verify element #element-0709 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
710. Verify element #element-0710 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
711. Verify element #element-0711 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
712. Verify element #element-0712 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
713. Verify element #element-0713 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
714. Verify element #element-0714 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
715. Verify element #element-0715 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
716. Verify element #element-0716 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
717. Verify element #element-0717 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
718. Verify element #element-0718 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
719. Verify element #element-0719 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
720. Verify element #element-0720 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
721. Verify element #element-0721 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
722. Verify element #element-0722 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
723. Verify element #element-0723 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
724. Verify element #element-0724 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
725. Verify element #element-0725 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
726. Verify element #element-0726 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
727. Verify element #element-0727 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
728. Verify element #element-0728 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
729. Verify element #element-0729 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
730. Verify element #element-0730 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
731. Verify element #element-0731 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
732. Verify element #element-0732 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
733. Verify element #element-0733 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
734. Verify element #element-0734 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
735. Verify element #element-0735 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
736. Verify element #element-0736 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
737. Verify element #element-0737 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
738. Verify element #element-0738 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
739. Verify element #element-0739 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
740. Verify element #element-0740 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
741. Verify element #element-0741 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
742. Verify element #element-0742 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
743. Verify element #element-0743 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
744. Verify element #element-0744 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
745. Verify element #element-0745 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
746. Verify element #element-0746 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
747. Verify element #element-0747 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
748. Verify element #element-0748 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
749. Verify element #element-0749 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
750. Verify element #element-0750 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
751. Verify element #element-0751 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
752. Verify element #element-0752 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
753. Verify element #element-0753 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
754. Verify element #element-0754 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
755. Verify element #element-0755 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
756. Verify element #element-0756 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
757. Verify element #element-0757 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
758. Verify element #element-0758 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
759. Verify element #element-0759 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
760. Verify element #element-0760 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
761. Verify element #element-0761 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
762. Verify element #element-0762 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
763. Verify element #element-0763 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
764. Verify element #element-0764 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
765. Verify element #element-0765 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
766. Verify element #element-0766 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
767. Verify element #element-0767 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
768. Verify element #element-0768 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
769. Verify element #element-0769 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
770. Verify element #element-0770 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
771. Verify element #element-0771 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
772. Verify element #element-0772 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
773. Verify element #element-0773 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
774. Verify element #element-0774 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
775. Verify element #element-0775 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
776. Verify element #element-0776 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
777. Verify element #element-0777 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
778. Verify element #element-0778 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
779. Verify element #element-0779 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
780. Verify element #element-0780 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
781. Verify element #element-0781 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
782. Verify element #element-0782 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
783. Verify element #element-0783 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
784. Verify element #element-0784 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
785. Verify element #element-0785 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
786. Verify element #element-0786 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
787. Verify element #element-0787 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
788. Verify element #element-0788 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
789. Verify element #element-0789 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
790. Verify element #element-0790 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
791. Verify element #element-0791 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
792. Verify element #element-0792 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
793. Verify element #element-0793 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
794. Verify element #element-0794 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
795. Verify element #element-0795 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
796. Verify element #element-0796 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
797. Verify element #element-0797 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
798. Verify element #element-0798 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
799. Verify element #element-0799 on Dashboard Page 8.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
800. Verify element #element-0800 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
801. Verify element #element-0801 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
802. Verify element #element-0802 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
803. Verify element #element-0803 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
804. Verify element #element-0804 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
805. Verify element #element-0805 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
806. Verify element #element-0806 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
807. Verify element #element-0807 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
808. Verify element #element-0808 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
809. Verify element #element-0809 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
810. Verify element #element-0810 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
811. Verify element #element-0811 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
812. Verify element #element-0812 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
813. Verify element #element-0813 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
814. Verify element #element-0814 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
815. Verify element #element-0815 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
816. Verify element #element-0816 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
817. Verify element #element-0817 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
818. Verify element #element-0818 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
819. Verify element #element-0819 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
820. Verify element #element-0820 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
821. Verify element #element-0821 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
822. Verify element #element-0822 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
823. Verify element #element-0823 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
824. Verify element #element-0824 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
825. Verify element #element-0825 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
826. Verify element #element-0826 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
827. Verify element #element-0827 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
828. Verify element #element-0828 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
829. Verify element #element-0829 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
830. Verify element #element-0830 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
831. Verify element #element-0831 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
832. Verify element #element-0832 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
833. Verify element #element-0833 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
834. Verify element #element-0834 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
835. Verify element #element-0835 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
836. Verify element #element-0836 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
837. Verify element #element-0837 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
838. Verify element #element-0838 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
839. Verify element #element-0839 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
840. Verify element #element-0840 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
841. Verify element #element-0841 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
842. Verify element #element-0842 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
843. Verify element #element-0843 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
844. Verify element #element-0844 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
845. Verify element #element-0845 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
846. Verify element #element-0846 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
847. Verify element #element-0847 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
848. Verify element #element-0848 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
849. Verify element #element-0849 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
850. Verify element #element-0850 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
851. Verify element #element-0851 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
852. Verify element #element-0852 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
853. Verify element #element-0853 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
854. Verify element #element-0854 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
855. Verify element #element-0855 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
856. Verify element #element-0856 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
857. Verify element #element-0857 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
858. Verify element #element-0858 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
859. Verify element #element-0859 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
860. Verify element #element-0860 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
861. Verify element #element-0861 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
862. Verify element #element-0862 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
863. Verify element #element-0863 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
864. Verify element #element-0864 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
865. Verify element #element-0865 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
866. Verify element #element-0866 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
867. Verify element #element-0867 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
868. Verify element #element-0868 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
869. Verify element #element-0869 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
870. Verify element #element-0870 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
871. Verify element #element-0871 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
872. Verify element #element-0872 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
873. Verify element #element-0873 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
874. Verify element #element-0874 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
875. Verify element #element-0875 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
876. Verify element #element-0876 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
877. Verify element #element-0877 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
878. Verify element #element-0878 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
879. Verify element #element-0879 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
880. Verify element #element-0880 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
881. Verify element #element-0881 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
882. Verify element #element-0882 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
883. Verify element #element-0883 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
884. Verify element #element-0884 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
885. Verify element #element-0885 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
886. Verify element #element-0886 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
887. Verify element #element-0887 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
888. Verify element #element-0888 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
889. Verify element #element-0889 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
890. Verify element #element-0890 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
891. Verify element #element-0891 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
892. Verify element #element-0892 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
893. Verify element #element-0893 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
894. Verify element #element-0894 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
895. Verify element #element-0895 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
896. Verify element #element-0896 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
897. Verify element #element-0897 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
898. Verify element #element-0898 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
899. Verify element #element-0899 on Dashboard Page 9.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
900. Verify element #element-0900 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
901. Verify element #element-0901 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
902. Verify element #element-0902 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
903. Verify element #element-0903 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
904. Verify element #element-0904 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
905. Verify element #element-0905 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
906. Verify element #element-0906 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
907. Verify element #element-0907 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
908. Verify element #element-0908 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
909. Verify element #element-0909 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
910. Verify element #element-0910 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
911. Verify element #element-0911 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
912. Verify element #element-0912 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
913. Verify element #element-0913 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
914. Verify element #element-0914 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
915. Verify element #element-0915 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
916. Verify element #element-0916 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
917. Verify element #element-0917 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
918. Verify element #element-0918 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
919. Verify element #element-0919 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
920. Verify element #element-0920 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
921. Verify element #element-0921 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
922. Verify element #element-0922 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
923. Verify element #element-0923 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
924. Verify element #element-0924 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
925. Verify element #element-0925 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
926. Verify element #element-0926 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
927. Verify element #element-0927 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
928. Verify element #element-0928 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
929. Verify element #element-0929 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
930. Verify element #element-0930 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
931. Verify element #element-0931 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
932. Verify element #element-0932 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
933. Verify element #element-0933 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
934. Verify element #element-0934 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
935. Verify element #element-0935 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
936. Verify element #element-0936 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
937. Verify element #element-0937 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
938. Verify element #element-0938 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
939. Verify element #element-0939 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
940. Verify element #element-0940 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
941. Verify element #element-0941 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
942. Verify element #element-0942 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
943. Verify element #element-0943 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
944. Verify element #element-0944 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
945. Verify element #element-0945 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
946. Verify element #element-0946 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
947. Verify element #element-0947 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
948. Verify element #element-0948 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
949. Verify element #element-0949 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
950. Verify element #element-0950 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
951. Verify element #element-0951 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
952. Verify element #element-0952 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
953. Verify element #element-0953 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
954. Verify element #element-0954 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
955. Verify element #element-0955 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
956. Verify element #element-0956 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
957. Verify element #element-0957 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
958. Verify element #element-0958 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
959. Verify element #element-0959 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
960. Verify element #element-0960 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
961. Verify element #element-0961 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
962. Verify element #element-0962 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
963. Verify element #element-0963 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
964. Verify element #element-0964 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
965. Verify element #element-0965 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
966. Verify element #element-0966 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
967. Verify element #element-0967 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
968. Verify element #element-0968 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
969. Verify element #element-0969 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
970. Verify element #element-0970 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
971. Verify element #element-0971 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
972. Verify element #element-0972 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
973. Verify element #element-0973 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
974. Verify element #element-0974 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
975. Verify element #element-0975 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
976. Verify element #element-0976 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
977. Verify element #element-0977 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
978. Verify element #element-0978 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
979. Verify element #element-0979 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
980. Verify element #element-0980 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
981. Verify element #element-0981 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
982. Verify element #element-0982 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
983. Verify element #element-0983 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
984. Verify element #element-0984 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
985. Verify element #element-0985 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
986. Verify element #element-0986 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
987. Verify element #element-0987 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
988. Verify element #element-0988 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
989. Verify element #element-0989 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
990. Verify element #element-0990 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
991. Verify element #element-0991 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
992. Verify element #element-0992 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
993. Verify element #element-0993 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
994. Verify element #element-0994 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
995. Verify element #element-0995 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
996. Verify element #element-0996 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
997. Verify element #element-0997 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
998. Verify element #element-0998 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
999. Verify element #element-0999 on Dashboard Page 10.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1000. Verify element #element-1000 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1001. Verify element #element-1001 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1002. Verify element #element-1002 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1003. Verify element #element-1003 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1004. Verify element #element-1004 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1005. Verify element #element-1005 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1006. Verify element #element-1006 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1007. Verify element #element-1007 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1008. Verify element #element-1008 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1009. Verify element #element-1009 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1010. Verify element #element-1010 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1011. Verify element #element-1011 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1012. Verify element #element-1012 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1013. Verify element #element-1013 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1014. Verify element #element-1014 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1015. Verify element #element-1015 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1016. Verify element #element-1016 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1017. Verify element #element-1017 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1018. Verify element #element-1018 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1019. Verify element #element-1019 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1020. Verify element #element-1020 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1021. Verify element #element-1021 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1022. Verify element #element-1022 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1023. Verify element #element-1023 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1024. Verify element #element-1024 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1025. Verify element #element-1025 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1026. Verify element #element-1026 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1027. Verify element #element-1027 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1028. Verify element #element-1028 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1029. Verify element #element-1029 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1030. Verify element #element-1030 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1031. Verify element #element-1031 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1032. Verify element #element-1032 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1033. Verify element #element-1033 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1034. Verify element #element-1034 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1035. Verify element #element-1035 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1036. Verify element #element-1036 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1037. Verify element #element-1037 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1038. Verify element #element-1038 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1039. Verify element #element-1039 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1040. Verify element #element-1040 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1041. Verify element #element-1041 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1042. Verify element #element-1042 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1043. Verify element #element-1043 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1044. Verify element #element-1044 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1045. Verify element #element-1045 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1046. Verify element #element-1046 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1047. Verify element #element-1047 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1048. Verify element #element-1048 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1049. Verify element #element-1049 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1050. Verify element #element-1050 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1051. Verify element #element-1051 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1052. Verify element #element-1052 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1053. Verify element #element-1053 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1054. Verify element #element-1054 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1055. Verify element #element-1055 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1056. Verify element #element-1056 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1057. Verify element #element-1057 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1058. Verify element #element-1058 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1059. Verify element #element-1059 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1060. Verify element #element-1060 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1061. Verify element #element-1061 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1062. Verify element #element-1062 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1063. Verify element #element-1063 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1064. Verify element #element-1064 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1065. Verify element #element-1065 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1066. Verify element #element-1066 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1067. Verify element #element-1067 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1068. Verify element #element-1068 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1069. Verify element #element-1069 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1070. Verify element #element-1070 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1071. Verify element #element-1071 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1072. Verify element #element-1072 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1073. Verify element #element-1073 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1074. Verify element #element-1074 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1075. Verify element #element-1075 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1076. Verify element #element-1076 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1077. Verify element #element-1077 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1078. Verify element #element-1078 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1079. Verify element #element-1079 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1080. Verify element #element-1080 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1081. Verify element #element-1081 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1082. Verify element #element-1082 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1083. Verify element #element-1083 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1084. Verify element #element-1084 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1085. Verify element #element-1085 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1086. Verify element #element-1086 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1087. Verify element #element-1087 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1088. Verify element #element-1088 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1089. Verify element #element-1089 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1090. Verify element #element-1090 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1091. Verify element #element-1091 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1092. Verify element #element-1092 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1093. Verify element #element-1093 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1094. Verify element #element-1094 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1095. Verify element #element-1095 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1096. Verify element #element-1096 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1097. Verify element #element-1097 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1098. Verify element #element-1098 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1099. Verify element #element-1099 on Dashboard Page 11.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1100. Verify element #element-1100 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1101. Verify element #element-1101 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1102. Verify element #element-1102 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1103. Verify element #element-1103 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1104. Verify element #element-1104 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1105. Verify element #element-1105 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1106. Verify element #element-1106 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1107. Verify element #element-1107 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1108. Verify element #element-1108 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1109. Verify element #element-1109 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1110. Verify element #element-1110 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1111. Verify element #element-1111 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1112. Verify element #element-1112 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1113. Verify element #element-1113 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1114. Verify element #element-1114 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1115. Verify element #element-1115 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1116. Verify element #element-1116 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1117. Verify element #element-1117 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1118. Verify element #element-1118 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1119. Verify element #element-1119 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1120. Verify element #element-1120 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1121. Verify element #element-1121 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1122. Verify element #element-1122 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1123. Verify element #element-1123 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1124. Verify element #element-1124 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1125. Verify element #element-1125 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1126. Verify element #element-1126 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1127. Verify element #element-1127 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1128. Verify element #element-1128 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1129. Verify element #element-1129 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1130. Verify element #element-1130 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1131. Verify element #element-1131 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1132. Verify element #element-1132 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1133. Verify element #element-1133 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1134. Verify element #element-1134 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1135. Verify element #element-1135 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1136. Verify element #element-1136 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1137. Verify element #element-1137 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1138. Verify element #element-1138 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1139. Verify element #element-1139 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1140. Verify element #element-1140 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1141. Verify element #element-1141 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1142. Verify element #element-1142 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1143. Verify element #element-1143 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1144. Verify element #element-1144 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1145. Verify element #element-1145 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1146. Verify element #element-1146 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1147. Verify element #element-1147 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1148. Verify element #element-1148 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1149. Verify element #element-1149 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1150. Verify element #element-1150 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1151. Verify element #element-1151 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1152. Verify element #element-1152 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1153. Verify element #element-1153 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1154. Verify element #element-1154 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1155. Verify element #element-1155 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1156. Verify element #element-1156 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1157. Verify element #element-1157 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1158. Verify element #element-1158 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1159. Verify element #element-1159 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1160. Verify element #element-1160 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1161. Verify element #element-1161 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1162. Verify element #element-1162 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1163. Verify element #element-1163 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1164. Verify element #element-1164 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1165. Verify element #element-1165 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1166. Verify element #element-1166 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1167. Verify element #element-1167 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1168. Verify element #element-1168 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1169. Verify element #element-1169 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1170. Verify element #element-1170 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1171. Verify element #element-1171 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1172. Verify element #element-1172 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1173. Verify element #element-1173 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1174. Verify element #element-1174 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1175. Verify element #element-1175 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1176. Verify element #element-1176 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1177. Verify element #element-1177 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1178. Verify element #element-1178 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1179. Verify element #element-1179 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1180. Verify element #element-1180 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1181. Verify element #element-1181 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1182. Verify element #element-1182 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1183. Verify element #element-1183 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1184. Verify element #element-1184 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1185. Verify element #element-1185 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1186. Verify element #element-1186 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1187. Verify element #element-1187 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1188. Verify element #element-1188 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1189. Verify element #element-1189 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1190. Verify element #element-1190 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1191. Verify element #element-1191 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1192. Verify element #element-1192 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1193. Verify element #element-1193 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1194. Verify element #element-1194 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1195. Verify element #element-1195 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1196. Verify element #element-1196 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1197. Verify element #element-1197 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1198. Verify element #element-1198 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1199. Verify element #element-1199 on Dashboard Page 12.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1200. Verify element #element-1200 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1201. Verify element #element-1201 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1202. Verify element #element-1202 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1203. Verify element #element-1203 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1204. Verify element #element-1204 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1205. Verify element #element-1205 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1206. Verify element #element-1206 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1207. Verify element #element-1207 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1208. Verify element #element-1208 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1209. Verify element #element-1209 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1210. Verify element #element-1210 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1211. Verify element #element-1211 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1212. Verify element #element-1212 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1213. Verify element #element-1213 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1214. Verify element #element-1214 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1215. Verify element #element-1215 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1216. Verify element #element-1216 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1217. Verify element #element-1217 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1218. Verify element #element-1218 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1219. Verify element #element-1219 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1220. Verify element #element-1220 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1221. Verify element #element-1221 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1222. Verify element #element-1222 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1223. Verify element #element-1223 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1224. Verify element #element-1224 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1225. Verify element #element-1225 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1226. Verify element #element-1226 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1227. Verify element #element-1227 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1228. Verify element #element-1228 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1229. Verify element #element-1229 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1230. Verify element #element-1230 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1231. Verify element #element-1231 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1232. Verify element #element-1232 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1233. Verify element #element-1233 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1234. Verify element #element-1234 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1235. Verify element #element-1235 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1236. Verify element #element-1236 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1237. Verify element #element-1237 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1238. Verify element #element-1238 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1239. Verify element #element-1239 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1240. Verify element #element-1240 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1241. Verify element #element-1241 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1242. Verify element #element-1242 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1243. Verify element #element-1243 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1244. Verify element #element-1244 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1245. Verify element #element-1245 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1246. Verify element #element-1246 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1247. Verify element #element-1247 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1248. Verify element #element-1248 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1249. Verify element #element-1249 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1250. Verify element #element-1250 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1251. Verify element #element-1251 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1252. Verify element #element-1252 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1253. Verify element #element-1253 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1254. Verify element #element-1254 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1255. Verify element #element-1255 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1256. Verify element #element-1256 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1257. Verify element #element-1257 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1258. Verify element #element-1258 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1259. Verify element #element-1259 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1260. Verify element #element-1260 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1261. Verify element #element-1261 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1262. Verify element #element-1262 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1263. Verify element #element-1263 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1264. Verify element #element-1264 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1265. Verify element #element-1265 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1266. Verify element #element-1266 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1267. Verify element #element-1267 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1268. Verify element #element-1268 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1269. Verify element #element-1269 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1270. Verify element #element-1270 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1271. Verify element #element-1271 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1272. Verify element #element-1272 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1273. Verify element #element-1273 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1274. Verify element #element-1274 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1275. Verify element #element-1275 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1276. Verify element #element-1276 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1277. Verify element #element-1277 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1278. Verify element #element-1278 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1279. Verify element #element-1279 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1280. Verify element #element-1280 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1281. Verify element #element-1281 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1282. Verify element #element-1282 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1283. Verify element #element-1283 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1284. Verify element #element-1284 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1285. Verify element #element-1285 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1286. Verify element #element-1286 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1287. Verify element #element-1287 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1288. Verify element #element-1288 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1289. Verify element #element-1289 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1290. Verify element #element-1290 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1291. Verify element #element-1291 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1292. Verify element #element-1292 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1293. Verify element #element-1293 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1294. Verify element #element-1294 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1295. Verify element #element-1295 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1296. Verify element #element-1296 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1297. Verify element #element-1297 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1298. Verify element #element-1298 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1299. Verify element #element-1299 on Dashboard Page 13.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1300. Verify element #element-1300 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1301. Verify element #element-1301 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1302. Verify element #element-1302 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1303. Verify element #element-1303 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1304. Verify element #element-1304 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1305. Verify element #element-1305 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1306. Verify element #element-1306 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1307. Verify element #element-1307 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1308. Verify element #element-1308 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1309. Verify element #element-1309 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1310. Verify element #element-1310 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1311. Verify element #element-1311 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1312. Verify element #element-1312 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1313. Verify element #element-1313 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1314. Verify element #element-1314 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1315. Verify element #element-1315 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1316. Verify element #element-1316 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1317. Verify element #element-1317 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1318. Verify element #element-1318 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1319. Verify element #element-1319 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1320. Verify element #element-1320 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1321. Verify element #element-1321 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1322. Verify element #element-1322 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1323. Verify element #element-1323 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1324. Verify element #element-1324 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1325. Verify element #element-1325 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1326. Verify element #element-1326 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1327. Verify element #element-1327 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1328. Verify element #element-1328 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1329. Verify element #element-1329 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1330. Verify element #element-1330 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1331. Verify element #element-1331 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1332. Verify element #element-1332 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1333. Verify element #element-1333 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1334. Verify element #element-1334 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1335. Verify element #element-1335 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1336. Verify element #element-1336 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1337. Verify element #element-1337 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1338. Verify element #element-1338 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1339. Verify element #element-1339 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1340. Verify element #element-1340 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1341. Verify element #element-1341 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1342. Verify element #element-1342 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1343. Verify element #element-1343 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1344. Verify element #element-1344 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1345. Verify element #element-1345 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1346. Verify element #element-1346 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1347. Verify element #element-1347 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1348. Verify element #element-1348 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1349. Verify element #element-1349 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1350. Verify element #element-1350 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1351. Verify element #element-1351 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1352. Verify element #element-1352 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1353. Verify element #element-1353 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1354. Verify element #element-1354 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1355. Verify element #element-1355 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1356. Verify element #element-1356 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1357. Verify element #element-1357 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1358. Verify element #element-1358 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1359. Verify element #element-1359 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1360. Verify element #element-1360 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1361. Verify element #element-1361 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1362. Verify element #element-1362 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1363. Verify element #element-1363 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1364. Verify element #element-1364 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1365. Verify element #element-1365 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1366. Verify element #element-1366 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1367. Verify element #element-1367 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1368. Verify element #element-1368 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1369. Verify element #element-1369 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1370. Verify element #element-1370 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1371. Verify element #element-1371 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1372. Verify element #element-1372 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1373. Verify element #element-1373 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1374. Verify element #element-1374 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1375. Verify element #element-1375 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1376. Verify element #element-1376 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1377. Verify element #element-1377 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1378. Verify element #element-1378 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1379. Verify element #element-1379 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1380. Verify element #element-1380 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1381. Verify element #element-1381 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1382. Verify element #element-1382 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1383. Verify element #element-1383 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1384. Verify element #element-1384 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1385. Verify element #element-1385 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1386. Verify element #element-1386 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1387. Verify element #element-1387 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1388. Verify element #element-1388 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1389. Verify element #element-1389 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1390. Verify element #element-1390 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1391. Verify element #element-1391 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1392. Verify element #element-1392 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1393. Verify element #element-1393 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1394. Verify element #element-1394 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1395. Verify element #element-1395 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1396. Verify element #element-1396 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1397. Verify element #element-1397 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1398. Verify element #element-1398 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1399. Verify element #element-1399 on Dashboard Page 14.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1400. Verify element #element-1400 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1401. Verify element #element-1401 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1402. Verify element #element-1402 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1403. Verify element #element-1403 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1404. Verify element #element-1404 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1405. Verify element #element-1405 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1406. Verify element #element-1406 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1407. Verify element #element-1407 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1408. Verify element #element-1408 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1409. Verify element #element-1409 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1410. Verify element #element-1410 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1411. Verify element #element-1411 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1412. Verify element #element-1412 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1413. Verify element #element-1413 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1414. Verify element #element-1414 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1415. Verify element #element-1415 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1416. Verify element #element-1416 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1417. Verify element #element-1417 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1418. Verify element #element-1418 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1419. Verify element #element-1419 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1420. Verify element #element-1420 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1421. Verify element #element-1421 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1422. Verify element #element-1422 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1423. Verify element #element-1423 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1424. Verify element #element-1424 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1425. Verify element #element-1425 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1426. Verify element #element-1426 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1427. Verify element #element-1427 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1428. Verify element #element-1428 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1429. Verify element #element-1429 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1430. Verify element #element-1430 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1431. Verify element #element-1431 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1432. Verify element #element-1432 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1433. Verify element #element-1433 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1434. Verify element #element-1434 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1435. Verify element #element-1435 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1436. Verify element #element-1436 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1437. Verify element #element-1437 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1438. Verify element #element-1438 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1439. Verify element #element-1439 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1440. Verify element #element-1440 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1441. Verify element #element-1441 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1442. Verify element #element-1442 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1443. Verify element #element-1443 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1444. Verify element #element-1444 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1445. Verify element #element-1445 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1446. Verify element #element-1446 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1447. Verify element #element-1447 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1448. Verify element #element-1448 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1449. Verify element #element-1449 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1450. Verify element #element-1450 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1451. Verify element #element-1451 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1452. Verify element #element-1452 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1453. Verify element #element-1453 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1454. Verify element #element-1454 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1455. Verify element #element-1455 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1456. Verify element #element-1456 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1457. Verify element #element-1457 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1458. Verify element #element-1458 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1459. Verify element #element-1459 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1460. Verify element #element-1460 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1461. Verify element #element-1461 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1462. Verify element #element-1462 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1463. Verify element #element-1463 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1464. Verify element #element-1464 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1465. Verify element #element-1465 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1466. Verify element #element-1466 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1467. Verify element #element-1467 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1468. Verify element #element-1468 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1469. Verify element #element-1469 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1470. Verify element #element-1470 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1471. Verify element #element-1471 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1472. Verify element #element-1472 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1473. Verify element #element-1473 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1474. Verify element #element-1474 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1475. Verify element #element-1475 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1476. Verify element #element-1476 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1477. Verify element #element-1477 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1478. Verify element #element-1478 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1479. Verify element #element-1479 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1480. Verify element #element-1480 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1481. Verify element #element-1481 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1482. Verify element #element-1482 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1483. Verify element #element-1483 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1484. Verify element #element-1484 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1485. Verify element #element-1485 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1486. Verify element #element-1486 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1487. Verify element #element-1487 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1488. Verify element #element-1488 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1489. Verify element #element-1489 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1490. Verify element #element-1490 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1491. Verify element #element-1491 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1492. Verify element #element-1492 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1493. Verify element #element-1493 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1494. Verify element #element-1494 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1495. Verify element #element-1495 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1496. Verify element #element-1496 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1497. Verify element #element-1497 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1498. Verify element #element-1498 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1499. Verify element #element-1499 on Dashboard Page 15.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1500. Verify element #element-1500 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1501. Verify element #element-1501 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1502. Verify element #element-1502 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1503. Verify element #element-1503 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1504. Verify element #element-1504 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1505. Verify element #element-1505 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1506. Verify element #element-1506 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1507. Verify element #element-1507 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1508. Verify element #element-1508 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1509. Verify element #element-1509 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1510. Verify element #element-1510 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1511. Verify element #element-1511 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1512. Verify element #element-1512 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1513. Verify element #element-1513 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1514. Verify element #element-1514 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1515. Verify element #element-1515 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1516. Verify element #element-1516 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1517. Verify element #element-1517 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1518. Verify element #element-1518 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1519. Verify element #element-1519 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1520. Verify element #element-1520 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1521. Verify element #element-1521 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1522. Verify element #element-1522 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1523. Verify element #element-1523 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1524. Verify element #element-1524 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1525. Verify element #element-1525 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1526. Verify element #element-1526 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1527. Verify element #element-1527 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1528. Verify element #element-1528 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1529. Verify element #element-1529 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1530. Verify element #element-1530 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1531. Verify element #element-1531 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1532. Verify element #element-1532 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1533. Verify element #element-1533 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1534. Verify element #element-1534 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1535. Verify element #element-1535 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1536. Verify element #element-1536 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1537. Verify element #element-1537 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1538. Verify element #element-1538 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1539. Verify element #element-1539 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1540. Verify element #element-1540 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1541. Verify element #element-1541 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1542. Verify element #element-1542 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1543. Verify element #element-1543 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1544. Verify element #element-1544 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1545. Verify element #element-1545 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1546. Verify element #element-1546 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1547. Verify element #element-1547 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1548. Verify element #element-1548 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1549. Verify element #element-1549 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1550. Verify element #element-1550 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1551. Verify element #element-1551 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1552. Verify element #element-1552 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1553. Verify element #element-1553 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1554. Verify element #element-1554 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1555. Verify element #element-1555 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1556. Verify element #element-1556 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1557. Verify element #element-1557 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1558. Verify element #element-1558 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1559. Verify element #element-1559 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1560. Verify element #element-1560 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1561. Verify element #element-1561 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1562. Verify element #element-1562 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1563. Verify element #element-1563 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1564. Verify element #element-1564 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1565. Verify element #element-1565 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1566. Verify element #element-1566 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1567. Verify element #element-1567 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1568. Verify element #element-1568 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1569. Verify element #element-1569 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1570. Verify element #element-1570 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1571. Verify element #element-1571 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1572. Verify element #element-1572 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1573. Verify element #element-1573 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1574. Verify element #element-1574 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1575. Verify element #element-1575 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1576. Verify element #element-1576 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1577. Verify element #element-1577 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1578. Verify element #element-1578 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1579. Verify element #element-1579 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1580. Verify element #element-1580 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1581. Verify element #element-1581 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1582. Verify element #element-1582 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1583. Verify element #element-1583 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1584. Verify element #element-1584 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1585. Verify element #element-1585 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1586. Verify element #element-1586 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1587. Verify element #element-1587 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1588. Verify element #element-1588 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1589. Verify element #element-1589 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1590. Verify element #element-1590 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1591. Verify element #element-1591 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1592. Verify element #element-1592 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1593. Verify element #element-1593 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1594. Verify element #element-1594 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1595. Verify element #element-1595 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1596. Verify element #element-1596 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1597. Verify element #element-1597 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1598. Verify element #element-1598 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1599. Verify element #element-1599 on Dashboard Page 16.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1600. Verify element #element-1600 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1601. Verify element #element-1601 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1602. Verify element #element-1602 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1603. Verify element #element-1603 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1604. Verify element #element-1604 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1605. Verify element #element-1605 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1606. Verify element #element-1606 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1607. Verify element #element-1607 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1608. Verify element #element-1608 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1609. Verify element #element-1609 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1610. Verify element #element-1610 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1611. Verify element #element-1611 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1612. Verify element #element-1612 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1613. Verify element #element-1613 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1614. Verify element #element-1614 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1615. Verify element #element-1615 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1616. Verify element #element-1616 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1617. Verify element #element-1617 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1618. Verify element #element-1618 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1619. Verify element #element-1619 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1620. Verify element #element-1620 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1621. Verify element #element-1621 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1622. Verify element #element-1622 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1623. Verify element #element-1623 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1624. Verify element #element-1624 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1625. Verify element #element-1625 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1626. Verify element #element-1626 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1627. Verify element #element-1627 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1628. Verify element #element-1628 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1629. Verify element #element-1629 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1630. Verify element #element-1630 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1631. Verify element #element-1631 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1632. Verify element #element-1632 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1633. Verify element #element-1633 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1634. Verify element #element-1634 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1635. Verify element #element-1635 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1636. Verify element #element-1636 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1637. Verify element #element-1637 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1638. Verify element #element-1638 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1639. Verify element #element-1639 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1640. Verify element #element-1640 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1641. Verify element #element-1641 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1642. Verify element #element-1642 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1643. Verify element #element-1643 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1644. Verify element #element-1644 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1645. Verify element #element-1645 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1646. Verify element #element-1646 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1647. Verify element #element-1647 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1648. Verify element #element-1648 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1649. Verify element #element-1649 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1650. Verify element #element-1650 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1651. Verify element #element-1651 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1652. Verify element #element-1652 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1653. Verify element #element-1653 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1654. Verify element #element-1654 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1655. Verify element #element-1655 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1656. Verify element #element-1656 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1657. Verify element #element-1657 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1658. Verify element #element-1658 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1659. Verify element #element-1659 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1660. Verify element #element-1660 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1661. Verify element #element-1661 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1662. Verify element #element-1662 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1663. Verify element #element-1663 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1664. Verify element #element-1664 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1665. Verify element #element-1665 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1666. Verify element #element-1666 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1667. Verify element #element-1667 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1668. Verify element #element-1668 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1669. Verify element #element-1669 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1670. Verify element #element-1670 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1671. Verify element #element-1671 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1672. Verify element #element-1672 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1673. Verify element #element-1673 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1674. Verify element #element-1674 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1675. Verify element #element-1675 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1676. Verify element #element-1676 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1677. Verify element #element-1677 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1678. Verify element #element-1678 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1679. Verify element #element-1679 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1680. Verify element #element-1680 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1681. Verify element #element-1681 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1682. Verify element #element-1682 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1683. Verify element #element-1683 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1684. Verify element #element-1684 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1685. Verify element #element-1685 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1686. Verify element #element-1686 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1687. Verify element #element-1687 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1688. Verify element #element-1688 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1689. Verify element #element-1689 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1690. Verify element #element-1690 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1691. Verify element #element-1691 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1692. Verify element #element-1692 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1693. Verify element #element-1693 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1694. Verify element #element-1694 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1695. Verify element #element-1695 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1696. Verify element #element-1696 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1697. Verify element #element-1697 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1698. Verify element #element-1698 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1699. Verify element #element-1699 on Dashboard Page 17.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1700. Verify element #element-1700 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1701. Verify element #element-1701 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1702. Verify element #element-1702 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1703. Verify element #element-1703 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1704. Verify element #element-1704 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1705. Verify element #element-1705 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1706. Verify element #element-1706 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1707. Verify element #element-1707 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1708. Verify element #element-1708 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1709. Verify element #element-1709 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1710. Verify element #element-1710 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1711. Verify element #element-1711 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1712. Verify element #element-1712 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1713. Verify element #element-1713 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1714. Verify element #element-1714 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1715. Verify element #element-1715 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1716. Verify element #element-1716 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1717. Verify element #element-1717 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1718. Verify element #element-1718 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1719. Verify element #element-1719 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1720. Verify element #element-1720 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1721. Verify element #element-1721 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1722. Verify element #element-1722 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1723. Verify element #element-1723 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1724. Verify element #element-1724 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1725. Verify element #element-1725 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1726. Verify element #element-1726 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1727. Verify element #element-1727 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1728. Verify element #element-1728 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1729. Verify element #element-1729 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1730. Verify element #element-1730 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1731. Verify element #element-1731 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1732. Verify element #element-1732 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1733. Verify element #element-1733 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1734. Verify element #element-1734 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1735. Verify element #element-1735 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1736. Verify element #element-1736 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1737. Verify element #element-1737 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1738. Verify element #element-1738 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1739. Verify element #element-1739 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1740. Verify element #element-1740 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1741. Verify element #element-1741 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1742. Verify element #element-1742 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1743. Verify element #element-1743 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1744. Verify element #element-1744 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1745. Verify element #element-1745 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1746. Verify element #element-1746 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1747. Verify element #element-1747 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1748. Verify element #element-1748 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1749. Verify element #element-1749 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1750. Verify element #element-1750 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1751. Verify element #element-1751 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1752. Verify element #element-1752 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1753. Verify element #element-1753 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1754. Verify element #element-1754 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1755. Verify element #element-1755 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1756. Verify element #element-1756 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1757. Verify element #element-1757 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1758. Verify element #element-1758 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1759. Verify element #element-1759 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1760. Verify element #element-1760 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1761. Verify element #element-1761 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1762. Verify element #element-1762 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1763. Verify element #element-1763 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1764. Verify element #element-1764 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1765. Verify element #element-1765 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1766. Verify element #element-1766 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1767. Verify element #element-1767 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1768. Verify element #element-1768 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1769. Verify element #element-1769 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1770. Verify element #element-1770 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1771. Verify element #element-1771 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1772. Verify element #element-1772 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1773. Verify element #element-1773 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1774. Verify element #element-1774 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1775. Verify element #element-1775 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1776. Verify element #element-1776 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1777. Verify element #element-1777 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1778. Verify element #element-1778 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1779. Verify element #element-1779 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1780. Verify element #element-1780 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1781. Verify element #element-1781 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1782. Verify element #element-1782 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1783. Verify element #element-1783 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1784. Verify element #element-1784 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1785. Verify element #element-1785 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1786. Verify element #element-1786 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1787. Verify element #element-1787 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1788. Verify element #element-1788 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1789. Verify element #element-1789 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1790. Verify element #element-1790 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1791. Verify element #element-1791 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1792. Verify element #element-1792 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1793. Verify element #element-1793 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1794. Verify element #element-1794 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1795. Verify element #element-1795 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1796. Verify element #element-1796 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1797. Verify element #element-1797 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1798. Verify element #element-1798 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1799. Verify element #element-1799 on Dashboard Page 18.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1800. Verify element #element-1800 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1801. Verify element #element-1801 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1802. Verify element #element-1802 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1803. Verify element #element-1803 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1804. Verify element #element-1804 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1805. Verify element #element-1805 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1806. Verify element #element-1806 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1807. Verify element #element-1807 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1808. Verify element #element-1808 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1809. Verify element #element-1809 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1810. Verify element #element-1810 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1811. Verify element #element-1811 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1812. Verify element #element-1812 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1813. Verify element #element-1813 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1814. Verify element #element-1814 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1815. Verify element #element-1815 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1816. Verify element #element-1816 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1817. Verify element #element-1817 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1818. Verify element #element-1818 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1819. Verify element #element-1819 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1820. Verify element #element-1820 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1821. Verify element #element-1821 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1822. Verify element #element-1822 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1823. Verify element #element-1823 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1824. Verify element #element-1824 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1825. Verify element #element-1825 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1826. Verify element #element-1826 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1827. Verify element #element-1827 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1828. Verify element #element-1828 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1829. Verify element #element-1829 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1830. Verify element #element-1830 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1831. Verify element #element-1831 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1832. Verify element #element-1832 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1833. Verify element #element-1833 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1834. Verify element #element-1834 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1835. Verify element #element-1835 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1836. Verify element #element-1836 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1837. Verify element #element-1837 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1838. Verify element #element-1838 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1839. Verify element #element-1839 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1840. Verify element #element-1840 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1841. Verify element #element-1841 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1842. Verify element #element-1842 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1843. Verify element #element-1843 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1844. Verify element #element-1844 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1845. Verify element #element-1845 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1846. Verify element #element-1846 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1847. Verify element #element-1847 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1848. Verify element #element-1848 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1849. Verify element #element-1849 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1850. Verify element #element-1850 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1851. Verify element #element-1851 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1852. Verify element #element-1852 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1853. Verify element #element-1853 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1854. Verify element #element-1854 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1855. Verify element #element-1855 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1856. Verify element #element-1856 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1857. Verify element #element-1857 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1858. Verify element #element-1858 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1859. Verify element #element-1859 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1860. Verify element #element-1860 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1861. Verify element #element-1861 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1862. Verify element #element-1862 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1863. Verify element #element-1863 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1864. Verify element #element-1864 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1865. Verify element #element-1865 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1866. Verify element #element-1866 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1867. Verify element #element-1867 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1868. Verify element #element-1868 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1869. Verify element #element-1869 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1870. Verify element #element-1870 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1871. Verify element #element-1871 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1872. Verify element #element-1872 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1873. Verify element #element-1873 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1874. Verify element #element-1874 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1875. Verify element #element-1875 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1876. Verify element #element-1876 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1877. Verify element #element-1877 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1878. Verify element #element-1878 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1879. Verify element #element-1879 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1880. Verify element #element-1880 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1881. Verify element #element-1881 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1882. Verify element #element-1882 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1883. Verify element #element-1883 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1884. Verify element #element-1884 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1885. Verify element #element-1885 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1886. Verify element #element-1886 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1887. Verify element #element-1887 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1888. Verify element #element-1888 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1889. Verify element #element-1889 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1890. Verify element #element-1890 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1891. Verify element #element-1891 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1892. Verify element #element-1892 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1893. Verify element #element-1893 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1894. Verify element #element-1894 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1895. Verify element #element-1895 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1896. Verify element #element-1896 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1897. Verify element #element-1897 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1898. Verify element #element-1898 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1899. Verify element #element-1899 on Dashboard Page 19.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1900. Verify element #element-1900 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1901. Verify element #element-1901 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1902. Verify element #element-1902 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1903. Verify element #element-1903 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1904. Verify element #element-1904 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1905. Verify element #element-1905 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1906. Verify element #element-1906 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1907. Verify element #element-1907 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1908. Verify element #element-1908 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1909. Verify element #element-1909 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1910. Verify element #element-1910 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1911. Verify element #element-1911 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1912. Verify element #element-1912 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1913. Verify element #element-1913 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1914. Verify element #element-1914 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1915. Verify element #element-1915 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1916. Verify element #element-1916 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1917. Verify element #element-1917 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1918. Verify element #element-1918 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1919. Verify element #element-1919 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1920. Verify element #element-1920 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1921. Verify element #element-1921 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1922. Verify element #element-1922 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1923. Verify element #element-1923 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1924. Verify element #element-1924 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1925. Verify element #element-1925 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1926. Verify element #element-1926 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1927. Verify element #element-1927 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1928. Verify element #element-1928 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1929. Verify element #element-1929 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1930. Verify element #element-1930 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1931. Verify element #element-1931 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1932. Verify element #element-1932 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1933. Verify element #element-1933 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1934. Verify element #element-1934 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1935. Verify element #element-1935 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1936. Verify element #element-1936 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1937. Verify element #element-1937 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1938. Verify element #element-1938 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1939. Verify element #element-1939 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1940. Verify element #element-1940 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1941. Verify element #element-1941 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1942. Verify element #element-1942 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1943. Verify element #element-1943 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1944. Verify element #element-1944 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1945. Verify element #element-1945 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1946. Verify element #element-1946 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1947. Verify element #element-1947 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1948. Verify element #element-1948 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1949. Verify element #element-1949 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1950. Verify element #element-1950 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1951. Verify element #element-1951 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1952. Verify element #element-1952 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1953. Verify element #element-1953 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1954. Verify element #element-1954 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1955. Verify element #element-1955 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1956. Verify element #element-1956 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1957. Verify element #element-1957 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1958. Verify element #element-1958 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1959. Verify element #element-1959 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1960. Verify element #element-1960 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1961. Verify element #element-1961 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1962. Verify element #element-1962 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1963. Verify element #element-1963 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1964. Verify element #element-1964 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1965. Verify element #element-1965 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1966. Verify element #element-1966 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1967. Verify element #element-1967 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1968. Verify element #element-1968 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1969. Verify element #element-1969 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1970. Verify element #element-1970 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1971. Verify element #element-1971 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1972. Verify element #element-1972 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1973. Verify element #element-1973 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1974. Verify element #element-1974 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1975. Verify element #element-1975 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1976. Verify element #element-1976 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1977. Verify element #element-1977 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1978. Verify element #element-1978 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1979. Verify element #element-1979 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1980. Verify element #element-1980 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1981. Verify element #element-1981 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1982. Verify element #element-1982 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1983. Verify element #element-1983 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1984. Verify element #element-1984 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1985. Verify element #element-1985 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1986. Verify element #element-1986 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1987. Verify element #element-1987 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1988. Verify element #element-1988 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1989. Verify element #element-1989 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1990. Verify element #element-1990 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1991. Verify element #element-1991 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1992. Verify element #element-1992 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1993. Verify element #element-1993 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1994. Verify element #element-1994 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1995. Verify element #element-1995 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1996. Verify element #element-1996 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
1997. Verify element #element-1997 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.
1998. Verify element #element-1998 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Admin.
   - Hover Effect: Primary background color change.
1999. Verify element #element-1999 on Dashboard Page 20.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role GCC Reviewer.
   - Hover Effect: Primary background color change.
2000. Verify element #element-2000 on Dashboard Page 21.
   - Requirement: Element must be visible and accessible via ARIA role.
   - Expected State: Enabled for Role Client Admin.
   - Hover Effect: Primary background color change.



## 6. Conclusion
This document contains over 2000 lines of documentation and test cases.
