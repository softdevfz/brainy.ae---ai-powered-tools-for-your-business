exports.up = function(knex) {
  return knex.schema.createTable('subscriptions', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('product_id').notNullable(); // 'pos' or 'stooge'
    table.string('product_name').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('currency', 3).defaultTo('USD');
    table.string('paypal_subscription_id').unique();
    table.string('paypal_order_id').unique();
    table.enum('status', ['trial', 'active', 'cancelled', 'expired', 'suspended']).defaultTo('trial');
    table.timestamp('trial_ends_at');
    table.timestamp('current_period_start');
    table.timestamp('current_period_end');
    table.timestamp('cancelled_at');
    table.json('paypal_data'); // Store PayPal webhook data
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('user_id');
    table.index('product_id');
    table.index('status');
    table.index('paypal_subscription_id');
    table.index('paypal_order_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('subscriptions');
}; 