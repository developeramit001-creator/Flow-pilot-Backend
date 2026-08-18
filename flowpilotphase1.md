# 🚀 FlowPilot Backend — Complete Postman API Testing Guide

**Base URL:** `http://localhost:5000`

## 0. Testing Order

1. Register
2. Verify Email
3. Login
4. Get Organization
5. Get Members
6. Invite Member
7. Refresh Token
8. Logout
9. Update Organization
10. Delete Organization
11. Accept Invite
12. Delete Member
13. Change Member Role

---

# 🔐 Postman Environment Variables

Postman में एक Environment बनाओ:

| Variable         | Initial Value           |
| ---------------- | ----------------------- |
| `baseUrl`        | `http://localhost:5000` |
| `accessToken`    | खाली                    |
| `refreshToken`   | खाली                    |
| `organizationId` | खाली                    |
| `userId`         | खाली                    |
| `verifyToken`    | खाली                    |
| `inviteToken`    | खाली                    |
| `memberId`       | खाली                    |

Protected API में Header:

```text
Authorization: Bearer {{accessToken}}
```

---

# 🟢 API 1 — Register

### Request

**Method:** `POST`

**URL:**

```text
{{baseUrl}}/api/auth/register
```

### Body

Body → raw → JSON

```json
{
  "name": "Amit Sharma",
  "email": "amit@flowpilot.com",
  "password": "SecurePass123",
  "dob": "1995-03-15",
  "orgName": "FlowPilot Inc."
}
```

### Expected

```json
{
  "success": true,
  "message": "Registration successful! Check your email.",
  "data": {
    "user": {
      "id": "...",
      "name": "Amit Sharma",
      "email": "amit@flowpilot.com"
    },
    "organization": {
      "id": "...",
      "name": "FlowPilot Inc.",
      "role": "owner"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Save

- [ ] `userId`
- [ ] `organizationId`
- [ ] `accessToken`
- [ ] `refreshToken`

> **Important:** Verify Email के लिए `verifyToken` अगर response में नहीं आता है, तो PostgreSQL database से verification token निकालो.

---

# 🟢 API 2 — Verify Email

### Request

**Method:** `GET`

**URL:**

```text
{{baseUrl}}/api/auth/verify/{{verifyToken}}
```

### Header

कोई Authorization जरूरी नहीं, अगर backend route ऐसा configured है.

### Expected

```json
{
  "success": true,
  "message": "Email verified successfully!"
}
```

### Test

- [ ] Verification URL सही है
- [ ] Token database वाला है
- [ ] `success: true`
- [ ] User verified हुआ

---

# 🟢 API 3 — Login

### Request

**Method:** `POST`

**URL:**

```text
{{baseUrl}}/api/auth/login
```

### Body

```json
{
  "email": "amit@flowpilot.com",
  "password": "SecurePass123"
}
```

### Expected

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Amit Sharma",
      "email": "amit@flowpilot.com"
    },
    "organizations": [
      {
        "id": "...",
        "name": "FlowPilot Inc.",
        "role": "owner"
      }
    ],
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Save New Tokens

- [ ] Replace `accessToken`
- [ ] Replace `refreshToken`
- [ ] Confirm `organizationId`
- [ ] Confirm `userId`

> **Important:** Login के बाद Register वाले पुराने tokens की जगह Login वाले नए tokens use करो.

---

# 🔵 API 4 — Get Organization

### Request

**Method:** `GET`

**URL:**

```text
{{baseUrl}}/api/organizations/{{organizationId}}
```

### Headers

```text
Authorization: Bearer {{accessToken}}
```

### Expected

```json
{
  "success": true,
  "data": {
    "organization": {
      "id": "...",
      "name": "FlowPilot Inc.",
      "slug": "flowpilot-inc",
      "logo": null,
      "created_by": "...",
      "created_at": "..."
    },
    "role": "owner"
  }
}
```

### Test

- [ ] Status code successful
- [ ] Organization ID correct
- [ ] Organization name correct
- [ ] User role returned
- [ ] Authorization works

---

# 🔵 API 5 — Get All Members

### Request

**Method:** `GET`

**URL:**

```text
{{baseUrl}}/api/{{organizationId}}/members
```

### Headers

```text
Authorization: Bearer {{accessToken}}
```

### Expected

```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "...",
        "email": "amit@flowpilot.com",
        "name": "Amit Sharma",
        "role": "owner",
        "joined_at": "..."
      }
    ],
    "total": 1,
    "role": "owner"
  }
}
```

### Test

- [ ] Members array returned
- [ ] Current user appears
- [ ] Correct organization members shown
- [ ] Total count correct
- [ ] Role returned

---

# 🔵 API 6 — Invite Member

### Request

**Method:** `POST`

**URL:**

```text
{{baseUrl}}/api/{{organizationId}}/invite
```

### Headers

```text
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

### Body

```json
{
  "email": "raj@flowpilot.com",
  "role": "member"
}
```

### Expected

```json
{
  "success": true,
  "message": "Invite sent to raj@flowpilot.com",
  "data": {
    "inviteId": "...",
    "email": "raj@flowpilot.com",
    "role": "member",
    "token": "..."
  }
}
```

### Save

- [ ] `inviteToken`
- [ ] `inviteId`

### Test

- [ ] Owner can invite
- [ ] Email correct
- [ ] Role correct
- [ ] Invite record created
- [ ] Token generated
- [ ] Email sending works, if configured

---

# 🟠 API 7 — Refresh Token

यह API तब test करो जब access token expire हो या manually refresh flow test करना हो.

### Request

**Method:** `POST`

**URL:**

```text
{{baseUrl}}/api/auth/refresh-token
```

### Body

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

### Expected

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### VERY IMPORTANT

अगर backend refresh-token rotation करता है:

- [ ] नया `accessToken` save करो
- [ ] नया `refreshToken` save करो
- [ ] पुराने refresh token को आगे use मत करो

---

# 🔴 API 8 — Logout

### Request

**Method:** `POST`

**URL:**

```text
{{baseUrl}}/api/auth/logout
```

### Body

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

### Expected

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Test

- [ ] Logout successful
- [ ] Refresh token revoked/deleted
- [ ] Same refresh token दोबारा use करने पर reject होना चाहिए

---

# 🟣 API 9 — Update Organization

### Request

**Method:** `PUT`

**URL:**

```text
{{baseUrl}}/api/organizations/{{organizationId}}
```

### Headers

```text
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

### Body

> अपने actual backend controller के अनुसार fields रखो. अगर organization update में `name` supported है:

```json
{
  "name": "FlowPilot Technologies"
}
```

### Expected

```json
{
  "success": true,
  "data": {
    "organization": {
      "id": "...",
      "name": "FlowPilot Technologies"
    }
  }
}
```

### Test

- [ ] Owner authorization works
- [ ] Organization updated
- [ ] Database value changed
- [ ] Unauthorized user rejected

---

# 🔴 API 10 — Delete Organization

⚠️ **यह destructive API है. सबसे last में test करना बेहतर है.**

### Request

**Method:** `DELETE`

**URL:**

```text
{{baseUrl}}/api/organizations/{{organizationId}}
```

### Headers

```text
Authorization: Bearer {{accessToken}}
```

### Expected

Backend के actual response के अनुसार success response मिलना चाहिए.

### Test

- [ ] Owner can delete
- [ ] Non-owner cannot delete
- [ ] Organization deleted
- [ ] Related organization data handled correctly
- [ ] Deleted organization GET request reject/fail होती है

> **Recommendation:** API 10 को पूरी testing के end में चलाओ क्योंकि इसके बाद उसी organization की बाकी APIs काम नहीं करेंगी.

---

# 🟡 API 11 — Accept Invite

### Request

**Method:** `POST`

**URL:**

```text
{{baseUrl}}/api/accept-invite/{{inviteToken}}
```

### Body

> अगर backend इस API में body नहीं मांगता, तो Body खाली रखो.

### Expected

Successful invitation acceptance response.

### Test

- [ ] Valid invite token accepted
- [ ] User organization में जुड़ा
- [ ] Correct role assigned
- [ ] Invite status updated
- [ ] Expired token rejected
- [ ] Invalid token rejected
- [ ] Used token दोबारा rejected

### After Accept Invite

फिर API 5 — **Get Members** चलाओ.

Check:

```text
raj@flowpilot.com
```

organization members में दिखाई देना चाहिए.

---

# 🔴 API 12 — Delete Member

### Request

**Method:** `DELETE`

**URL:**

```text
{{baseUrl}}/api/{{organizationId}}/members/{{memberId}}
```

### Headers

```text
Authorization: Bearer {{accessToken}}
```

### `memberId`

API 5 — Get Members response से target member का ID लो.

### Expected

Successful member removal response.

### Test

- [ ] Owner/admin permission checked
- [ ] Correct member deleted
- [ ] Member organization से remove हुआ
- [ ] Get Members में member नहीं दिखता
- [ ] Unauthorized user rejected

---

# 🟣 API 13 — Change Member Role

### Request

**Method:** `PUT`

**URL:**

```text
{{baseUrl}}/api/{{organizationId}}/members/{{memberId}}/role
```

### Headers

```text
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

### Body

> अपने backend controller में expected field का नाम confirm करो. Common example:

```json
{
  "role": "admin"
}
```

या:

```json
{
  "role": "member"
}
```

### Expected

Successful role update response.

### Test

- [ ] Owner/admin can change role
- [ ] Member cannot change another member's role
- [ ] Role changed in database
- [ ] Get Members में new role दिखाई देता है
- [ ] Invalid role rejected

---

# 📊 Complete API Master Checklist

| #   | API                                  | Method | Auth | Tested |
| --- | ------------------------------------ | ------ | ---- | ------ |
| 1   | `/api/auth/register`                 | POST   | ❌   | [ ]    |
| 2   | `/api/auth/verify/:token`            | GET    | ❌   | [ ]    |
| 3   | `/api/auth/login`                    | POST   | ❌   | [ ]    |
| 4   | `/api/organizations/:orgId`          | GET    | ✅   | [ ]    |
| 5   | `/api/:orgId/members`                | GET    | ✅   | [ ]    |
| 6   | `/api/:orgId/invite`                 | POST   | ✅   | [ ]    |
| 7   | `/api/auth/refresh-token`            | POST   | ❌   | [ ]    |
| 8   | `/api/auth/logout`                   | POST   | ❌   | [ ]    |
| 9   | `/api/organizations/:orgId`          | PUT    | ✅   | [ ]    |
| 10  | `/api/organizations/:orgId`          | DELETE | ✅   | [ ]    |
| 11  | `/api/accept-invite/:token`          | POST   | ❌\* | [ ]    |
| 12  | `/api/:orgId/members/:memberId`      | DELETE | ✅   | [ ]    |
| 13  | `/api/:orgId/members/:memberId/role` | PUT    | ✅   | [ ]    |

`*` Accept Invite में auth आपके actual backend implementation पर depend कर सकता है.

---

# 🧪 Negative Testing

सिर्फ success APIs test मत करना. ये भी test करो:

## Authentication

- [ ] Wrong email
- [ ] Wrong password
- [ ] Empty email
- [ ] Invalid email
- [ ] Weak password
- [ ] Duplicate registration
- [ ] Unverified user login
- [ ] Invalid verification token
- [ ] Expired verification token

## Authorization

- [ ] No Authorization header
- [ ] Invalid JWT
- [ ] Expired JWT
- [ ] Wrong organization ID
- [ ] Member accessing owner-only API
- [ ] Non-member accessing organization

## Refresh Token

- [ ] Invalid refresh token
- [ ] Expired refresh token
- [ ] Already-used refresh token
- [ ] Refresh after logout

## Invite

- [ ] Invalid invite token
- [ ] Expired invite
- [ ] Already-used invite
- [ ] Duplicate invite
- [ ] Invalid role

## Members

- [ ] Delete non-existing member
- [ ] Change role of non-existing member
- [ ] Member tries to delete another member
- [ ] Member tries to change role

---

# 🗄️ PostgreSQL Database Verification

API testing के साथ database भी verify करो.

Check:

- [ ] User created
- [ ] Organization created
- [ ] Organization membership created
- [ ] Verification token stored
- [ ] User verification status changed
- [ ] Refresh token stored
- [ ] Refresh token rotated
- [ ] Refresh token revoked after logout
- [ ] Invitation created
- [ ] Invitation accepted
- [ ] Member added
- [ ] Member role updated
- [ ] Member removed
- [ ] Organization deleted correctly

---

# 🚨 Important Testing Sequence

Recommended complete flow:

```text
REGISTER
   ↓
VERIFY EMAIL
   ↓
LOGIN
   ↓
GET ORGANIZATION
   ↓
GET MEMBERS
   ↓
INVITE MEMBER
   ↓
ACCEPT INVITE
   ↓
GET MEMBERS AGAIN
   ↓
CHANGE MEMBER ROLE
   ↓
GET MEMBERS AGAIN
   ↓
DELETE MEMBER
   ↓
GET MEMBERS AGAIN
   ↓
REFRESH TOKEN
   ↓
LOGOUT
   ↓
TEST OLD REFRESH TOKEN → SHOULD FAIL
```

## ⚠️ DELETE ORGANIZATION

```text
DELETE ORGANIZATION
```

को **सबसे आखिर में** test करो.

---

# ✅ Final Backend Testing Checklist

- [ ] PostgreSQL connected
- [ ] Server running on port 5000
- [ ] Register working
- [ ] Verify Email working
- [ ] Login working
- [ ] Access token generated
- [ ] Refresh token generated
- [ ] Protected routes working
- [ ] Organization GET working
- [ ] Members GET working
- [ ] Invite working
- [ ] Accept Invite working
- [ ] Role update working
- [ ] Member delete working
- [ ] Organization update working
- [ ] Refresh token working
- [ ] Logout working
- [ ] Old refresh token rejected
- [ ] Invalid JWT rejected
- [ ] Unauthorized requests rejected
- [ ] Database records verified
- [ ] Organization delete tested last

---

# 🎯 Success Criteria

Backend को successfully tested तब मानो जब:

```text
✅ Authentication works
✅ JWT Authorization works
✅ Organization CRUD works
✅ Member management works
✅ Invitation flow works
✅ Role management works
✅ Refresh token rotation works
✅ Logout/revocation works
✅ Invalid requests properly rejected
✅ PostgreSQL data correctly updated
```

**Final Status:**

```text
Total APIs: 13
Passed: ____ / 13
Failed: ____ / 13
Blocked: ____ / 13

Backend Testing Status: __________________
```
