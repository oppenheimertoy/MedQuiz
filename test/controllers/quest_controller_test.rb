require "test_helper"

class QuestControllerTest < ActionDispatch::IntegrationTest
  test "should get identification" do
    get quest_identification_url
    assert_response :success
  end

  test "should get try" do
    get quest_try_url
    assert_response :success
  end

  test "should get result" do
    get quest_result_url
    assert_response :success
  end
end
