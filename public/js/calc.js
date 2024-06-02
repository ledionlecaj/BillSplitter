

const main = function () {
    const nameContainer = document.getElementById("billDescriptionContainer");
    const partySizeContainer = document.getElementById("partySizeContainer");
    const partyNamesContainer = document.getElementById("partyNamesContainer");
    const itemListContainer = document.getElementById("itemListContainer");
    const addItemContainer = document.getElementById("addItemContainer");
    const resultsContainer = document.getElementById("resultsContainer");

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });


    let billName;
    let partySize;
    let partyNames = [];

    const submitName = document.getElementById("submitName");
    submitName.addEventListener('click', function (evt) {
        billName = document.getElementById("billName").value;
        if (!billName) {
            document.getElementById('billNameError').textContent = "Please enter a bill description.";
        } else {
            nameContainer.classList.add('hidden');
            partySizeContainer.classList.remove('hidden');
            document.getElementById('billNameError').textContent = "";
        }
    });

    const backToName = document.getElementById("backToName");
    backToName.addEventListener('click', function (evt) {
        partySizeContainer.classList.add('hidden');
        nameContainer.classList.remove('hidden');
    });

    const submitPartySize = document.getElementById("submitPartySize");
    const submitPartyNames = document.createElement('button');
    submitPartyNames.textContent = "Next";
    const partyNamesError = document.createElement('p');
    partyNamesError.classList.add("errMsg");

    submitPartySize.addEventListener('click', function (evt) {
        partySize = parseInt(document.getElementById('partySize').value);
        if (!partySize || partySize <= 1 || partySize > 16) {
            document.getElementById('partySizeError').textContent = "Please enter a valid party size.";
        } else {
            partySizeContainer.classList.add('hidden');
            partyNamesContainer.classList.remove('hidden');
            for (let i = 0; i < partySize; i++) {
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.placeholder = `Party member ${i + 1}`;
                partyNames.push(inp);
                partyNamesContainer.appendChild(inp);
                partyNamesContainer.appendChild(document.createElement('br'));
            }
            partyNamesContainer.appendChild(submitPartyNames);
            partyNamesContainer.appendChild(partyNamesError);
            document.getElementById('partySizeError').textContent = "";
        }
    });


    submitPartyNames.addEventListener('click', function (evt) {
        let validInput = true;
        for (let i = 0; i < partySize; i++) {
            const pmName = partyNames[i].value;
            if (!pmName) {
                partyNamesError.textContent = "Please fill out all party names";
                validInput = false;
            }
        }
        if (validInput) {
            partyNamesError.textContent = "";
            const partyNamesSet = new Set(partyNames.map((x) => x.value));
            if (partyNamesSet.size < partySize) {
                partyNamesError.textContent = "Please make sure party names are unique.";
            } else {
                partyNamesContainer.classList.add('hidden');
                itemListContainer.classList.remove('hidden');
                partyNamesError.textContent = "";
                const partyMemberSelection = document.getElementById("partyMemberSelection");
                partyMemberSelection.classList.add('checkboxContainer');
                partyNames.map((x) => {
                    const div = document.createElement('div');
                    const inp = document.createElement('input');
                    inp.type = "checkbox";
                    inp.name = x.value;
                    inp.id = x.value;
                    const lbl = document.createElement('label');
                    lbl.htmlFor = x.value;
                    lbl.textContent = x.value;
                    div.appendChild(inp);
                    div.appendChild(lbl);
                    div.classList.add('checkbox');
                    partyMemberSelection.appendChild(div);
                })

            }
        }
    });

    const addItemBtn = document.getElementById("addItem");
    addItemBtn.addEventListener('click', function (evt) {
        itemListContainer.classList.add('hidden');
        addItemContainer.classList.remove('hidden');

    });





    const currentItems = document.getElementById("currentItems");
    const submitItemBtn = document.getElementById("submitItem");
    const cancelItemBtn = document.getElementById("cancelAddItem");

    submitItemBtn.addEventListener('click', function (evt) {
        const itemName = document.getElementById("addItemName").value;
        const itemQuantity = document.getElementById("addItemQuantity").value;
        const itemPrice = document.getElementById("addItemPrice").value;
        if (!itemName) {
            document.getElementById('addItemError').textContent = "Please enter an item name.";
        } else if (!itemQuantity) {
            document.getElementById('addItemError').textContent = "Please enter an item quantity.";
        } else if (!itemPrice) {
            document.getElementById('addItemError').textContent = "Please enter unit price.";
        } else {
            const partyMembersSelected = [];
            for (let i = 0; i < partySize; i++) {
                if (document.getElementById(`${partyNames[i].value}`).checked) {
                    partyMembersSelected.push(partyNames[i].value);
                    document.getElementById(`${partyNames[i].value}`).checked = false;
                }
            }
            if (partyMembersSelected.length == 0) {
                document.getElementById('addItemError').textContent = "Please select a party memeber.";
            } else {
                document.getElementById('addItemError').textContent = "";
                const d = document.createElement('div');
                d.classList.add("itemContainer");
                const p1 = document.createElement('p');
                p1.textContent = `Name: ${itemName}`;
                p1.classList.add("inlineParagraph");
                const p2 = document.createElement('p');
                p2.textContent = `Quantity: ${itemQuantity}x`;
                p2.classList.add("inlineParagraph");
                const p3 = document.createElement('p');
                p3.textContent = `Unit Price: $${itemPrice} ea.`;
                p3.classList.add("inlineParagraph");
                const p4 = document.createElement('h3');
                p4.textContent = "Party Members";
                d.appendChild(p1);
                d.appendChild(p2);
                d.appendChild(p3);
                d.appendChild(p4);

                document.getElementById("addItemName").value = "";
                document.getElementById("addItemQuantity").value = "";
                document.getElementById("addItemPrice").value = "";
                const div = document.createElement('div');
                div.classList.add("ulContainer");
                partyMembersSelected.map((x) => {
                    const li = document.createElement('li');
                    li.textContent += `${x}`;
                    div.appendChild(li);
                });
                d.appendChild(div);

                const removeThisItem = document.createElement("button");
                removeThisItem.textContent = "Remove";
                removeThisItem.class = "removeItem";
                removeThisItem.addEventListener('click', function (evt) {
                    removeThisItem.parentNode.parentNode.removeChild(removeThisItem.parentNode);
                });

                d.appendChild(removeThisItem);

                currentItems.appendChild(d);
                addItemContainer.classList.add('hidden');
                itemListContainer.classList.remove('hidden');

            }
        }
    });

    cancelItemBtn.addEventListener('click', function (evt) {
        document.getElementById("addItemName").value = "";
        document.getElementById("addItemQuantity").value = "";
        document.getElementById("addItemPrice").value = "";
        for (let i = 0; i < partySize; i++) {
            document.getElementById(`${partyNames[i].value}`).checked = false;
        }
        addItemContainer.classList.add('hidden');
        itemListContainer.classList.remove('hidden');
    });

    const calcBtn = document.getElementById("calculate");
    calcBtn.addEventListener('click', function (evt) {
        const partyMembers = [];
        const tax = parseFloat(document.getElementById("tax").value);
        const tip = parseInt(document.getElementById("tip").value);

        if (!tax) {
            document.getElementById("calculateError").textContent = "Please enter a tax amount.";
        } else if (!tip) {
            document.getElementById("calculateError").textContent = "Please enter a tip percentage.";
        } else {
            document.getElementById("calculateError").textContent = "";
            const foodItemDivs = currentItems.children;
            partyNames.map((x) => {
                const temp = {
                    name: x.value,
                    cost: 0.00,
                    taxShare: 0.00,
                    tipShare: 0.00,
                    totalCost: 0.00
                }
                partyMembers.push(temp);
            });
            for (let i = 0; i < foodItemDivs.length; i++) {
                const div = foodItemDivs[i];
                let quantity = div.children[1].textContent.split(' ')[1];
                quantity = parseInt(quantity.substring(0, quantity.length - 1));
                let unitPrice = div.children[2].textContent.split(' ')[2].trim();
                unitPrice = parseFloat(unitPrice.split(" ")[0].substring(1));
                const totalPrice = quantity * unitPrice;
                const partyMembersList = div.children[4].children;
                const pricePerMember = totalPrice / partyMembersList.length;
                for (let j = 0; j < partyMembersList.length; j++) {
                    const name = partyMembersList[j].textContent;
                    for (let k = 0; k < partyMembers.length; k++) {
                        if (name === partyMembers[k].name) {
                            partyMembers[k].cost += pricePerMember;
                        }
                    }
                }
            }

            let totalPrice = 0;
            for (let i = 0; i < partyMembers.length; i++) {
                totalPrice += partyMembers[i].cost;
            }

            for (let i = 0; i < partyMembers.length; i++) {
                const p = partyMembers[i];
                p.taxShare += (p.cost / totalPrice) * tax;
                p.tipShare += (p.cost * (tip / 100.0));
                p.totalCost += p.cost + p.taxShare + p.tipShare;
            }

            const partyMemberCosts = document.getElementById("partyMemberCosts");
            for (let i = 0; i < partyMembers.length; i++) {
                const pm = partyMembers[i];
                pm.cost = formatter.format(pm.cost);
                pm.totalCost = formatter.format(pm.totalCost);
                pm.taxShare = formatter.format(pm.taxShare);
                pm.tipShare = formatter.format(pm.tipShare);
                const div = document.createElement('div');
                const p = document.createElement('p');
                p.textContent = `${pm.name} Total: $${pm.totalCost}`;
                p.classList.add('billResultTotal');
                const p2 = document.createElement('p');
                p2.textContent = `{ Base: $${pm.cost} | Tax: $${pm.taxShare}} | Tip: $${pm.tipShare}}`;
                p2.classList.add('billResultDetail');
                div.appendChild(p);
                div.appendChild(p2);
                partyMemberCosts.appendChild(div);
            }
            //show next div
            itemListContainer.classList.add("hidden");
            resultsContainer.classList.remove("hidden");
        }
    });

    const backToAddBtn = document.getElementById("backToAddItem");
    backToAddBtn.addEventListener('click', function (evt) {
        resultsContainer.classList.add("hidden");
        itemListContainer.classList.remove("hidden");
        const partyMemberCosts = document.getElementById("partyMemberCosts");
        while (partyMemberCosts.firstChild) {
            partyMemberCosts.removeChild(partyMemberCosts.firstChild);
        }
    });
    const saveReceiptBtn = document.getElementById("saveReceipt");
    saveReceiptBtn.addEventListener('click', async function (evt) {
        const receipt = {};
        receipt.date = Date.now();
        receipt.name = billName;
        receipt.party = [];
        partyNames.map((x) => receipt.party.push(x.value));
        receipt.foodItems = [];
        for (let i = 0; i < currentItems.children.length; i++) {
            const x = currentItems.children[i];
            const item = {};
            let name = x.children[0].textContent;
            name = name.substring(name.indexOf(" "));
            item.name = name;
            let quantity = x.children[1].textContent.split(' ')[1];
            quantity = parseInt(quantity.substring(0, quantity.length - 1));
            item.quantity = quantity;
            let unitPrice = x.children[2].textContent.split(' ')[2].trim();
            unitPrice = parseFloat(unitPrice.split(" ")[0].substring(1));
            item.unitPrice = unitPrice;
            item.partyMembers = [];
            const partyMembersList = x.children[4].children;
            for (let j = 0; j < partyMembersList.length; j++) {
                item.partyMembers.push(partyMembersList[j].textContent);
            }
            receipt.foodItems.push(item);
        }
        receipt.tax = parseFloat(document.getElementById("tax").value);
        receipt.tip = parseInt(document.getElementById("tip").value);

        const req = new XMLHttpRequest();
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                document.getElementById("dashboardRedirect").click();
            }
        });
        req.open('POST', "/dashboard", true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        req.send(`receipt=${JSON.stringify(receipt)}`);
    });
}


document.addEventListener('DOMContentLoaded', main);