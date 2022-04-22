require "test_helper"

class IndexControllerTest < ActionDispatch::IntegrationTest
  test "should get greeting" do
    get index_greeting_url
    assert_response :success
  end
end
