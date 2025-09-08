export const TextConfig = {
  // 表单相关文本
  form: {
    title: i18n.t('app.title'),
    typeLabel: i18n.t('expense.columns.type'),
    nameLabel: i18n.t('expense.columns.name'),
    amountLabel: i18n.t('expense.columns.amount'),
    timeLabel: i18n.t('expense.columns.time'),
    submitBtn: i18n.t('app.addRecord')
  },
  // 表格相关文本
  table: {
    columns: [i18n.t('expense.columns.type'), i18n.t('expense.columns.name'), i18n.t('expense.columns.amount'), i18n.t('expense.columns.time')],
    emptyText: i18n.t('expense.emptyText')
  },
  // 图表相关文本
  chart: {
    title: i18n.t('expense.chart.title'),
    legend: i18n.t('expense.chart.legend')
  }
};