export class CcblTable {
    public static default_table() {
        return '<table class="table table-sm table-condensed table-bordered table-responsive-md text-center table-sm sb-small"' +
            ' border="1" cellpadding="1" cellspacing="1" style="width:100%">\n' +
            '<tbody>\n' +
            '<tr>\n' +
            '<td colspan="2" rowspan="2" style="text-align:center">Group concerns/facilities</td>\n' +
            '<td colspan="3" rowspan="1" style="text-align:center">Existing</td>\n' +
            '<td style="text-align:center">O/S</td>\n' +
            '<td colspan="2" rowspan="1" style="text-align:center">Overdue</td>\n' +
            '<td colspan="2" rowspan="1" style="text-align:center">R/E Collateral</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="text-align:center">FB Limit</td>\n' +
            '<td style="text-align:center">NFB Limit</td>\n' +
            '<td style="text-align:center">Total</td>\n' +
            '<td style="text-align:center">Principal</td>\n' +
            '<td style="text-align:center">Principal</td>\n' +
            '<td style="text-align:center">Interest</td>\n' +
            '<td style="text-align:center">FMV</td>\n' +
            '<td style="text-align:center">DV</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="width:20px">1.</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="width:20px">&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td colspan="1" rowspan="5">&nbsp;</td>\n' +
            '<td colspan="1" rowspan="5">&nbsp;</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="width:20px">&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="width:20px">&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="width:20px">&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="width:20px">&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '</tr>\n' +
            '<tr>\n' +
            '<td style="width:20px">&nbsp;</td>\n' +
            '<td></td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '<td>&nbsp;</td>\n' +
            '</tr>\n' +
            '</tbody>\n' +
            '</table>\n' +
            '\n' +
            '<p>&nbsp;</p>';
    }


    public static outstandingOverdueTable() {
        return '<table class="table table-sm table-condensed table-bordered table-responsive-md text-center table-sm sb-small"' +
        ' border="1" cellpadding="1" cellspacing="1" style="width:100%">\n' +
        '<tbody>\n' +
        '<tr>\n' +
        '<td colspan="2" rowspan="2" style="text-align:center">Group concerns</td>\n' +
        '<td colspan="3" rowspan="1" style="text-align:center">Outstanding</td>\n' +
        '<td colspan="2" rowspan="1" style="text-align:center">Overdue</td>\n' +
        '<td colspan="4" rowspan="1" style="text-align:center">R/E Collateral</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="text-align:center">FB</td>\n' +
        '<td style="text-align:center">NFB</td>\n' +
        '<td style="text-align:center">Total</td>\n' +
        '<td style="text-align:center">Principal</td>\n' +
        '<td style="text-align:center">Interest</td>\n' +
        '<td colspan="2" style="text-align:center">Existing</td>\n' +
        '<td colspan="2" style="text-align:center">Proposed</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">1.</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>FMV</td>\n' +
        '<td>DV</td>\n' +
        '<td>FMV</td>\n' +
        '<td>DV</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td >&nbsp;</td>\n' +
        '<td >&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td style="text-align:center">Total</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '</tbody>\n' +
        '</table>\n' +
        '\n' +
        '<p>&nbsp;</p> ' +
            '<span>Note: BLC/Force Loan, if any:</span>';

}

public static groupPosition()
{
    return '<table class="table table-sm table-condensed table-bordered table-responsive-md text-center table-sm sb-small"' +
        ' border="1" cellpadding="1" cellspacing="1" style="width:100%">\n' +
        '<tbody>\n' +
        '<tr>\n' +
        '<td colspan="2" rowspan="2" style="text-align:center">Group concerns</td>\n' +
        '<td colspan="3" rowspan="1" style="text-align:center">Existing</td>\n' +
        '<td colspan="3" rowspan="1" style="text-align:center">Proposed</td>\n' +
        '<td  rowspan="1" style="text-align:center">Change</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="text-align:center">FB limit</td>\n' +
        '<td style="text-align:center">NFB limit</td>\n' +
        '<td style="text-align:center">Total</td>\n' +
        '<td style="text-align:center">FB limit</td>\n' +
        '<td style="text-align:center">NFB limit</td>\n' +
        '<td  style="text-align:center">Total</td>\n' +
        '<td  style="text-align:center">&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">1.</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +

        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td style="text-align:center">Total</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '</tbody>\n' +
        '</table>\n' +
        '\n' +
        '<p>&nbsp;</p> ';
}
}
