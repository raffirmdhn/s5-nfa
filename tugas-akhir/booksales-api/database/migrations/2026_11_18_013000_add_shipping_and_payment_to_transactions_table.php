<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('recipient_name', 100)->nullable()->after('status');
            $table->string('phone', 30)->nullable()->after('recipient_name');
            $table->text('shipping_address')->nullable()->after('phone');
            $table->text('notes')->nullable()->after('shipping_address');
            $table->string('payment_method', 30)->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'recipient_name',
                'phone',
                'shipping_address',
                'notes',
                'payment_method',
            ]);
        });
    }
};
