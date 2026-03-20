const { getSession, requestJson } = require('./salesforce/client');

const SALESFORCE_OBJECTS = {
    account: 'Account',
    contact: 'Contact',
};

function assertSalesforceUser(user) {
    if (!user?.email) throw new Error('user.email is required');
    if (!user?.name) throw new Error('user.name is required');
}

function splitName(name) {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
        return { firstName: undefined, lastName: 'Unknown' };
    }
    if (parts.length === 1) {
        return { firstName: undefined, lastName: parts[0] };
    }
    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' '),
    };
}

async function createSObject(baseUrl, objectName, accessToken, payload) {
    return requestJson(`${baseUrl}/sobjects/${objectName}`, {
        method: 'POST',
        accessToken,
        body: payload,
    });
}

async function updateSObject(baseUrl, objectName, recordId, accessToken, payload) {
    await requestJson(`${baseUrl}/sobjects/${objectName}/${recordId}`, {
        method: 'PATCH',
        accessToken,
        body: payload,
    });
}

function getDuplicateContactId(errorBody) {
    if (!Array.isArray(errorBody)) return null;
    const duplicate = errorBody.find((e) => e?.errorCode === 'DUPLICATES_DETECTED');
    return duplicate?.duplicateResult?.matchResults?.[0]?.matchRecords?.[0]?.record?.Id || null;
}

async function createAccount(baseUrl, accessToken, company, description) {
    const payload = { Name: company };
    if (description) payload.Description = description;

    try {
        const account = await createSObject(baseUrl, SALESFORCE_OBJECTS.account, accessToken, payload);
        return { account, accountDescriptionSaved: Boolean(description) };
    } catch (err) {
        if (!description) throw err;
        const account = await createSObject(baseUrl, SALESFORCE_OBJECTS.account, accessToken, { Name: company });
        return { account, accountDescriptionSaved: false };
    }
}

async function createContact(baseUrl, accessToken, user, accountId, phone, description) {
    const { firstName, lastName } = splitName(user.name);
    const payload = {
        LastName: lastName,
        Email: user.email,
        AccountId: accountId,
    };
    if (firstName) payload.FirstName = firstName;
    if (phone) payload.Phone = phone;
    if (description) payload.Description = description;

    try {
        const created = await createSObject(baseUrl, SALESFORCE_OBJECTS.contact, accessToken, payload);
        return { contact: created, reusedExisting: false };
    } catch (err) {
        const existingContactId = getDuplicateContactId(err?.body);
        if (!existingContactId) throw err;

        const updatePayload = { AccountId: accountId };
        if (phone) updatePayload.Phone = phone;
        if (description) updatePayload.Description = description;
        await updateSObject(baseUrl, SALESFORCE_OBJECTS.contact, existingContactId, accessToken, updatePayload);

        return { contact: { id: existingContactId }, reusedExisting: true };
    }
}

module.exports.salesforceCreateAccountAndContact = async function salesforceCreateAccountAndContact({ user, company, phone, description }) {
    if (!company) throw new Error('company is required');
    assertSalesforceUser(user);

    const { accessToken, apiBase, apiVersion } = await getSession();
    const { account, accountDescriptionSaved } = await createAccount(apiBase, accessToken, company, description);

    const accountId = account?.id;
    if (!accountId) throw new Error('Salesforce Account creation failed (no id returned)');

    const { contact, reusedExisting } = await createContact(
        apiBase,
        accessToken,
        user,
        accountId,
        phone,
        description
    );

    const contactId = contact?.id;
    if (!contactId) throw new Error('Salesforce Contact creation failed (no id returned)');

    return { accountId, contactId, apiVersion, accountDescriptionSaved, reusedExistingContact: reusedExisting };
}
