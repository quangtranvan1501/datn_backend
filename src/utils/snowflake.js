class Snowflake {
    constructor(custom_epoch = 1672531200000) { // Epoch bắt đầu từ ngày 1 tháng 1 năm 2023
      this.custom_epoch = custom_epoch;
      this.sequence = 0;
      this.node_id = 1; // Định danh của node, điều chỉnh nếu bạn có nhiều node
      this.node_id_bits = 2; // Số bit cho node_id
      this.sequence_bits = 10; // Số bit cho sequence
      this.node_id_shift = this.sequence_bits;
      this.timestamp_left_shift = this.sequence_bits + this.node_id_bits;
      this.sequence_mask = ~(-1 << this.sequence_bits);
      this.last_timestamp = -1;
    }
  
    currentTimestamp() {
      return Date.now();
    }
  
    nextId() {
      let timestamp = this.currentTimestamp();
  
      if (timestamp < this.last_timestamp) {
        throw new Error('Clock moved backwards. Refusing to generate id');
      }
  
      if (timestamp === this.last_timestamp) {
        this.sequence = (this.sequence + 1) & this.sequence_mask;
        if (this.sequence === 0) {
          while (timestamp <= this.last_timestamp) {
            timestamp = this.currentTimestamp();
          }
        }
      } else {
        this.sequence = 0;
      }
  
      this.last_timestamp = timestamp;
  
      // Tạo ID và chuyển nó thành chuỗi số
      let id = ((timestamp - this.custom_epoch) << this.timestamp_left_shift) |
               (this.node_id << this.node_id_shift) |
               this.sequence;
  
      return Math.abs(id).toString(); // Giới hạn độ dài 12 số
    }
  }
  
  const snowflake = new Snowflake();
  
  function generateSnowflakeId() {
    return snowflake.nextId();
  }
  
  module.exports = { generateSnowflakeId };
  